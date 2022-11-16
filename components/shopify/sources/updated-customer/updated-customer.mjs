import shopify from "../../shopify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "shopify-updated-customer",
  name: "Updated Customer", /* eslint-disable-line pipedream/source-name */
  type: "source",
  description: "Emit new event each time a customer's information is updated.",
  version: "0.0.8",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    shopify,
  },
  methods: {
    _getLastUpdatedDate() {
      return this.db.get("last_updated_at") || null;
    },
    _setLastUpdatedDate(date) {
      this.db.set("last_updated_at", date);
    },
  },
  async run() {
    const lastUpdatedAt = this._getLastUpdatedDate();
    let results = await this.shopify.getCustomers(null, lastUpdatedAt);

    for (const customer of results) {
      const id = `${customer.id}-${customer.updated_at}`;
      this.$emit(customer, {
        id,
        summary: `Customer updated: ${customer.id}`,
        ts: Date.parse(customer.updated_at),
      });
    }

    if (results[results.length - 1]) {
      this._setLastUpdatedDate(results[results.length - 1].updated_at);
    }
  },
};
