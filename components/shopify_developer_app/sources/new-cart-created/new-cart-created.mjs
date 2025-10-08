import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-cart-created",
  name: "New Cart Created (Instant)",
  description: "Emit new event when a new cart is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "CARTS_CREATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Cart Created ${resource.id}`,
        ts,
      };
    },
  },
};
