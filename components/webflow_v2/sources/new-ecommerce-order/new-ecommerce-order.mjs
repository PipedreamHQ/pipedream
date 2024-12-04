import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow_v2-new-ecommerce-order",
  name: "New E-commerce Order",
  description:
    "Emit new event when an e-commerce order is created. [See the docs here](https://developers.webflow.com/#order-model)",
  version: "0.0.1",
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      const { siteId } = this;
      console.log("Retrieving historical events...");

      const events = await this.app.listOrders({
        siteId,
        limit: 10,
      });
      this.emitHistoricalEvents(events);
    },
  },
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
