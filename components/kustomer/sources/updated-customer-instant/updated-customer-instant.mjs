import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import kustomer from "../../kustomer.app.mjs";

export default {
  key: "kustomer-updated-customer-instant",
  name: "Updated Customer",
  description: "Emit a new event when an existing customer's details are updated in Kustomer. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    kustomer,
    db: {
      type: "$.service.db",
      secret: false,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const customers = await this._getCustomers({
        limit: 50,
        sort: "-updatedAt",
      });

      for (const customer of customers) {
        this.$emit(
          {
            name: customer.name,
            url: customer.url,
            event: "kustomer.customer.update",
          },
          {
            id: customer.id,
            summary: `Updated customer: ${customer.name}`,
            ts: new Date(customer.updatedAt).getTime(),
          },
        );
      }

      if (customers.length > 0) {
        const latestUpdatedAt = Math.max(...customers.map((c) => new Date(c.updatedAt).getTime()));
        this.db.set("lastUpdatedAt", latestUpdatedAt);
      }
    },
    async activate() {
      // No activation logic required for polling source
    },
    async deactivate() {
      // No deactivation logic required for polling source
    },
  },
  methods: {
    async _getCustomers({
      limit = 50, sort = "-updatedAt", since = null,
    }) {
      const params = {
        limit,
        sort,
      };
      if (since) {
        params.filter = {
          updatedAt: {
            gte: new Date(since).toISOString(),
          },
        };
      }

      return await this.kustomer._makeRequest({
        path: "/customers",
        params,
      });
    },
  },
  async run() {
    const lastUpdatedAt = this.db.get("lastUpdatedAt") || 0;
    const customers = await this._getCustomers({
      limit: 50,
      sort: "updatedAt",
      since: lastUpdatedAt,
    });

    for (const customer of customers) {
      this.$emit(
        {
          name: customer.name,
          url: customer.url,
          event: "kustomer.customer.update",
        },
        {
          id: customer.id,
          summary: `Updated customer: ${customer.name}`,
          ts: new Date(customer.updatedAt).getTime(),
        },
      );

      const customerUpdatedAt = new Date(customer.updatedAt).getTime();

      if (customerUpdatedAt > lastUpdatedAt) {
        this.db.set("lastUpdatedAt", customerUpdatedAt);
      }
    }
  },
};
