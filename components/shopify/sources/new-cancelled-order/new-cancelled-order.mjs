import shopify from "../../shopify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "shopify-new-cancelled-order",
  name: "New Cancelled Order",
  type: "source",
  description: "Emit new event each time a new order is cancelled.",
  version: "0.0.7",
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
    let results = await this.shopify.getOrders(
      "any",
      true,
      null,
      lastUpdatedAt,
      "cancelled",
    );

    for (const order of results) {
      this.$emit(order, {
        id: order.id,
        summary: `Order cancelled: ${order.name}`,
        ts: Date.parse(order.updated_at),
      });
    }

    if (results[results.length - 1]) {
      this._setLastUpdatedDate(results[results.length - 1].updated_at);
    }
  },
};
