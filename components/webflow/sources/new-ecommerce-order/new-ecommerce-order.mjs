import common from "../common/common.mjs";

export default {
  type: "source",
  key: "webflow-new-ecommerce-order",
  name: "New E-commerce Order",
  description:
    "Emit new event when an e-commerce order is created. [See the documentation](https://developers.webflow.com/data/reference/webhooks/events/ecomm-new-order)",
  version: "2.0.0",
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
