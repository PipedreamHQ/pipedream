const common = require("../common");

module.exports = {
  ...common,
  key: "webflow-changed-ecomm-inventory",
  name: "Changed E-commerce Inventory (Instant)",
  description: "Emit an event when an e-commerce inventory level changes",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_inventory_changed";
    },
    generateMeta(data) {
      const { _id: id } = data;
      const summary = `E-comm inventory changed: ${id}`;
      const ts = Date.now();
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
