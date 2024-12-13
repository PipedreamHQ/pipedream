import pennylane from "../../pennylane.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "pennylane-new-customer",
  name: "New Customer Created",
  description: "Emit a new event when a customer is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pennylane,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    customerTagsOrMetadataFilters: {
      propDefinition: [
        pennylane,
        "customerTagsOrMetadataFilters",
      ],
    },
  },
  methods: {
    async _fetchCustomers(params) {
      return this.pennylane.paginate(this.pennylane.listCustomers, params);
    },
    _getLastTimestamp() {
      return this.db.get("lastRunTs") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastRunTs", timestamp);
    },
    _emitCustomer(customer) {
      const timestamp = Date.parse(customer.created_at) || Date.now();
      const id = customer.id || customer.source_id || timestamp;
      this.$emit(customer, {
        id,
        summary: `New Customer: ${customer.name}`,
        ts: timestamp,
      });
    },
  },
  hooks: {
    async deploy() {
      const params = {
        per_page: 50,
      };

      if (this.customerTagsOrMetadataFilters) {
        params.filter = JSON.stringify(this.customerTagsOrMetadataFilters);
      }

      const customers = await this._fetchCustomers(params);

      // Emit customers in order from oldest to newest
      const sortedCustomers = customers.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );

      sortedCustomers.forEach((customer) => this._emitCustomer(customer));

      if (customers.length > 0) {
        const latestCustomer = customers.reduce((latest, customer) => {
          const customerTs = Date.parse(customer.created_at);
          return customerTs > latest
            ? customerTs
            : latest;
        }, 0);
        this._setLastTimestamp(latestCustomer);
      }
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook subscription to remove for polling source
    },
  },
  async run() {
    const lastRunTs = this._getLastTimestamp();
    const params = {
      per_page: 50,
      sort: "created_at",
      order: "asc",
    };

    if (this.customerTagsOrMetadataFilters) {
      params.filter = JSON.stringify(this.customerTagsOrMetadataFilters);
    }

    const customers = await this._fetchCustomers(params);

    const newCustomers = customers.filter(
      (customer) => Date.parse(customer.created_at) > lastRunTs,
    );

    newCustomers.forEach((customer) => this._emitCustomer(customer));

    if (newCustomers.length > 0) {
      const latestCustomerTs = newCustomers.reduce((latest, customer) => {
        const customerTs = Date.parse(customer.created_at);
        return customerTs > latest
          ? customerTs
          : latest;
      }, lastRunTs);
      this._setLastTimestamp(latestCustomerTs);
    }
  },
};
