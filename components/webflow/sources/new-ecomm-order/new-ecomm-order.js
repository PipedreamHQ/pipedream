const common = require("../common");

module.exports = {
  ...common,
  key: "webflow-new-ecomm-order",
  name: "New E-commerce Order (Instant)",
  description: "Emit an event when an e-commerce order is created",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_new_order";
    },
    generateMeta(data) {
      const {
        acceptedOn,
        orderId: id,
      } = data;
      const summary = `New e-comm order: ${id}`;
      const ts = Date.parse(acceptedOn);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
