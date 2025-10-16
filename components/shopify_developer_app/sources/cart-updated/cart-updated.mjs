import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "shopify_developer_app-cart-updated",
  name: "Cart Updated (Instant)",
  description: "Emit new event when a cart is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "CARTS_UPDATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Cart Updated ${resource.id}`,
        ts,
      };
    },
  },
};
