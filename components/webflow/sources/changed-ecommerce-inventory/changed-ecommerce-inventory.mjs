import common from "../common.mjs";

export default {
  type: "source",
  key: "webflow-changed-ecommerce-inventory",
  name: "New Changed E-commerce Inventory",
  description: "Emit new event when an e-commerce inventory level changes. [See the docs here](https://developers.webflow.com/#item-inventory)",
  version: "0.1.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_inventory_changed";
    },
    generateMeta(data) {
      return {
        id: data._id,
        summary: `E-commerce ${data._id} inventory changed`,
        ts: Date.now(),
      };
    },
  },
};
