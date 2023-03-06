import shopify from "../../shopify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "shopify-product-added-to-custom-collection",
  name: "Product Added to Custom Collection",
  description: "Emit new event each time a product is added to a custom collection.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    shopify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getSinceId() {
      return this.db.get("sinceId") || null;
    },
    _setSinceId(sinceId) {
      this.db.set("sinceId", sinceId);
    },
  },
  async run() {
    const sinceId = this._getSinceId();
    const results = await this.shopify.getCollects(sinceId);

    for (const collect of results) {
      this.$emit(collect, {
        id: collect.id,
        summary: `Product ${collect.product_id} added to collection ${collect.collection_id}`,
        ts: Date.parse(collect.created_at),
      });
    }

    if (results.length > 0)
      this._setSinceId(results[results.length - 1].id);
  },
};
