import chargify from "../../chargify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chargify-new-customer",
  name: "New Customer",
  description: "Emits an event when a new customer is added in Chargify",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    chargify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getCustomerId(customer) {
      return customer.id;
    },
    _getTimestamp(customer) {
      return +new Date(customer.created_at);
    },
  },
  hooks: {
    async deploy() {
      const customers = await this.chargify._makeRequest({
        path: "/customers",
        params: { order: "desc", per_page: 1 },
      });
      if (customers.length > 0) {
        const lastProcessedCustomerId = this._getCustomerId(customers[0]);
        this.db.set("lastProcessedCustomerId", lastProcessedCustomerId);
        const lastTimestamp = this._getTimestamp(customers[0]);
        this.db.set("lastTimestamp", lastTimestamp);
      }
    },
  },
  async run() {
    const lastCustomerId = this.db.get("lastProcessedCustomerId") || 0;
    const lastTimestamp = this.db.get("lastTimestamp") || 0;
    const params = {
      page: 1,
      per_page: 100,
    };

    while (true) {
      const { data: customers } = await this.chargify._makeRequest({
        path: "/customers",
        params,
      });

      if (customers.length === 0) {
        console.log("No new customers found, exiting");
        break;
      }

      for (const customer of customers) {
        const customerId = this._getCustomerId(customer);
        const timestamp = this._getTimestamp(customer);

        if (customerId > lastCustomerId && timestamp > lastTimestamp) {
          this.$emit(customer, {
            id: customerId,
            summary: `New Customer: ${customer.first_name} ${customer.last_name}`,
            ts: timestamp,
          });
        } else {
          console.log("No new customers found, exiting");
          break;
        }
      }

      params.page++;
    }

    const { data: latestCustomer } = await this.chargify._makeRequest({
      path: "/customers",
      params: { order: "desc", per_page: 1 },
    });

    this.db.set("lastCustomerId", this._getCustomerId(latestCustomer[0]));
    this.db.set("lastTimestamp", this._getTimestamp(latestCustomer[0]));
  },
};