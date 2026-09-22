import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lightspeed_x-product-updated",
  name: "Product Updated (Instant)",
  description: "Emit new event when a product is updated. [See the documentation](https://x-series-api.lightspeedhq.com/v2026.01/reference/post-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "product.update";
    },
    generateMeta(product) {
      const ts = Date.parse(product.updated_at);
      return {
        id: `${product.id}-${ts}`,
        summary: `Product with ID ${product.id} updated`,
        ts,
      };
    },
  },
  sampleEmit,
};
