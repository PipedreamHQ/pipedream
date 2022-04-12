import common from "../common.mjs";

export default {
  type: "source",
  key: "webflow-new-ecommerce-order",
  name: "New E-commerce Order",
  description: "Emit new event when an e-commerce order is created. [See the docs here](https://developers.webflow.com/#order-model)",
  version: "0.1.1",
  ...common,
  methods: {
    ...common.methods,
    getWebhookTriggerType() {
      return "ecomm_new_order";
    },
    generateMeta(data) {
      return {
        id: data.orderId,
        summary: `New ${data.orderId} e-commerce order`,
        ts: Date.parse(data.acceptedOn),
      };
    },
  },
};
