import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-changed-ecommerce-order",
  name: "E-commerce Order Updated",
  description: "Emit new event when an e-commerce order is changed. [See the documentation](https://developers.webflow.com/data/reference/webhooks/events/ecomm-order-changed)",
  version: "2.0.0",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_order_changed";
    },
    generateMeta({ orderId }) {
      const ts = Date.now();
      return {
        id: `${orderId}-${ts}`,
        summary: `E-comm order updated: ${orderId}`,
        ts,
      };
    },
  },
};
