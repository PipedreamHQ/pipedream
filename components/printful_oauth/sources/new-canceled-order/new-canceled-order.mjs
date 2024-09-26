import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Canceled Order (Instant)",
  version: "0.0.1",
  key: "printful_oauth-new-canceled-order",
  description: "Emit new event on each canceled order.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "order_canceled";
    },
    async deploy() {
      const orders = await this.printful_oauth.getOrders({
        params: {
          limit: 10,
          status: "canceled",
        },
      });

      orders.reverse().forEach(this.emitEvent);
    },
    emitEvent(body) {
      const data = body?.data?.order ?? body;

      this.$emit(data, {
        id: data.id,
        summary: `New order canceled with id ${data.id}`,
        ts: Date.parse(data.updated),
      });
    },
  },
};
