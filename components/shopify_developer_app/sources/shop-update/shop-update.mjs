import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "shopify_developer_app-shop-update",
  name: "Shop Updated (Instant)",
  description: "Emit new event when a shop is updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "SHOP_UPDATE";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Shop Updated ${resource.id}`,
        ts,
      };
    },
  },
};
