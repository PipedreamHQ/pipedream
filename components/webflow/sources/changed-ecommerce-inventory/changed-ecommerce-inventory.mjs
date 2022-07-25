import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-changed-ecommerce-inventory",
  name: "New Changed E-commerce Inventory",
  description: "Emit new event when an e-commerce inventory level changes. [See the docs here](https://developers.webflow.com/#item-inventory)",
  version: "0.2.0",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_inventory_changed";
    },
    generateMeta(data) {
      const now = Date.now();

      return {
        id: `${data._id}-${now}`,
        summary: `E-commerce ${data._id} inventory changed`,
        ts: now,
      };
    },
  },
};
