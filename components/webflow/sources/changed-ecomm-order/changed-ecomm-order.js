const common = require("../common");

module.exports = {
  ...common,
  key: "webflow-changed-ecomm-order",
  name: "Changed E-commerce Order (Instant)",
  description: "Emit an event when an e-commerce order is changed",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_order_changed";
    },
    generateMeta(data) {
      const { orderId } = data;
      const summary = `E-comm order changed: ${orderId}`;
      const ts = Date.now();
      const id = `${orderId}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
