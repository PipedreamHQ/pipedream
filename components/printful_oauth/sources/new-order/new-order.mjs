import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Order (Instant)",
  version: "0.0.1",
  key: "printful_oauth-new-order",
  description: "Emit new event on each created order.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "order_created";
    },
    async deploy() {
      const orders = await this.printful_oauth.getOrders({
        params: {
          limit: 10,
        },
      });

      orders.reverse().forEach(this.emitEvent);
    },
    emitEvent(body) {
      const data = body?.data?.order ?? body;

      this.$emit(data, {
        id: data.id,
        summary: `New order created with id ${data.id}`,
        ts: Date.parse(data.created),
      });
    },
  },
};
