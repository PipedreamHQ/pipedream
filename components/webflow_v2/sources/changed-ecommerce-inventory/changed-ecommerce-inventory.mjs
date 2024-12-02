import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow_v2-changed-ecommerce-inventory",
  name: "E-commerce Inventory Updated",
  description: "Emit new event when an e-commerce inventory level changes. [See the docs here](https://developers.webflow.com/#item-inventory)",
  version: "0.0.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_inventory_changed";
    },
    generateMeta(data) {
      const ts = Date.now();
      const { id } = data;

      return {
        id: `${id}-${ts}`,
        summary: `E-comm inventory updated: ${id}`,
        ts,
      };
    },
  },
};
