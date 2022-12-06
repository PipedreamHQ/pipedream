import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-changed-ecommerce-order",
  name: "New Changed E-commerce Order",
  description: "Emit new event when an e-commerce order is changed. [See the docs here](https://developers.webflow.com/#order-model)",
  version: "0.2.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_order_changed";
    },
    generateMeta(data) {
      const now = Date.now();

      return {
        id: `${data.orderId}-${now}`,
        summary: `E-commerce order ${data.orderId} changed`,
        ts: now,
      };
    },
  },
};
