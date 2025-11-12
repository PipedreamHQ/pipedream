import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "americommerce-new-product-instant",
  name: "New Product Instant",
  description: "Emit new event when a product is added to your Americommerce store. [See the documentation](https://developers.cart.com/docs/rest-api/ZG9jOjM1MDU4Nw-webhooks#subscribing-to-a-webhook).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return events.PRODUCT_CREATED;
    },
    generateMeta(resource) {
      const { product } = resource;
      return {
        id: product.id,
        summary: `New Product: ${product.id}`,
        ts: Date.parse(product.created_at),
      };
    },
  },
  sampleEmit,
};
