import ascora from "../../ascora.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "ascora-new-customer-created",
  name: "New Customer Created in Ascora",
  description: "Emits an event whenever a new customer is created in Ascora. [See the documentation](https://support.ascora.com.au/display/AS/API+Endpoints)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ascora,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCustomerId() {
      return this.db.get("lastCustomerId") || null;
    },
    _setLastCustomerId(lastCustomerId) {
      this.db.set("lastCustomerId", lastCustomerId);
    },
  },
  hooks: {
    async deploy() {
      // Fetch customers to determine the most recent customer's ID
      const response = await this.ascora.searchCustomer({
        customerIdentifier: "",
      });
      const customers = response.data;
      if (customers.length > 0) {
        const sortedCustomers = customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const lastCustomers = sortedCustomers.slice(0, 50);
        for (const customer of lastCustomers) {
          this.$emit(customer, {
            id: customer.id,
            summary: `New Customer: ${customer.name}`,
            ts: Date.parse(customer.created_at),
          });
        }
        this._setLastCustomerId(lastCustomers[0].id);
      }
    },
  },
  async run() {
    // Fetch new customers since the last run
    const lastCustomerId = this._getLastCustomerId();
    let newCustomers = [];
    let page = 0;
    let nextPage = true;

    while (nextPage) {
      const response = await this.ascora.searchCustomer({
        customerIdentifier: "",
        page,
      });
      const customers = response.data;
      newCustomers = customers.filter((customer) => customer.id > lastCustomerId);

      if (customers.length === 0 || newCustomers.length < customers.length) {
        nextPage = false;
      }

      for (const customer of newCustomers) {
        this.$emit(customer, {
          id: customer.id,
          summary: `New Customer: ${customer.name}`,
          ts: Date.parse(customer.created_at),
        });
      }

      if (newCustomers.length > 0) {
        const mostRecentCustomer = newCustomers[newCustomers.length - 1];
        this._setLastCustomerId(mostRecentCustomer.id);
      }

      page++;
    }
  },
};
