import shopify from "../../shopify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "shopify-updated-order",
  name: "Updated Order", /* eslint-disable-line pipedream/source-name */
  type: "source",
  description: "Emit new event each time an order is updated.",
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
    );

    for (const order of results) {
      const id = `${order.id}-${order.updated_at}`;
      this.$emit(order, {
        id,
        summary: `Order updated: ${order.name}`,
        ts: Date.parse(order.updated_at),
      });
    }

    if (results[results.length - 1]) {
      this._setLastUpdatedDate(results[results.length - 1].updated_at);
    }
  },
};
