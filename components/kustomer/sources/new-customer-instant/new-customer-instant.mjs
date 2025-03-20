import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-new-customer-instant",
  name: "New Customer Created",
  description: "Emit new event when a new customer is added to Kustomer. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kustomer: {
      type: "app",
      app: "kustomer",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const customers = await this.kustomer.listCustomers({
        limit: 50,
        sort: "-createdAt",
      });
      for (const customer of customers) {
        this.$emit(
          {
            name: customer.name,
            url: customer.urls?.[0] || "",
          },
          {
            id: customer.id,
            summary: `New Kustomer Customer: ${customer.name}`,
            ts: Date.parse(customer.createdAt) || Date.now(),
          },
        );
      }
      if (customers.length > 0) {
        this.db.set("last_created_at", customers[0].createdAt);
      }
    },
    async activate() {
      // No activation steps needed for polling source
    },
    async deactivate() {
      // No deactivation steps needed for polling source
    },
  },
  async run() {
    const lastCreatedAt = (await this.db.get("last_created_at")) || new Date(0).toISOString();
    const newCustomers = await this.kustomer.listCustomers({
      filter: `createdAt > "${lastCreatedAt}"`,
      sort: "createdAt",
      limit: 50,
    });
    for (const customer of newCustomers) {
      this.$emit(
        {
          name: customer.name,
          url: customer.urls?.[0] || "",
        },
        {
          id: customer.id,
          summary: `New Kustomer Customer: ${customer.name}`,
          ts: Date.parse(customer.createdAt) || Date.now(),
        },
      );
    }
    if (newCustomers.length > 0) {
      const latestCreatedAt = newCustomers[newCustomers.length - 1].createdAt;
      this.db.set("last_created_at", latestCreatedAt);
    }
  },
};
