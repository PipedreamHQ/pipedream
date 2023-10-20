import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Fulfilled Order (Instant)",
  version: "0.0.1",
  key: "printful_oauth-new-fulfilled-order",
  description: "Emit new event on each fulfilled order.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "order_updated";
    },
    async deploy() {
      const orders = await this.printful_oauth.getOrders({
        params: {
          limit: 10,
          state: "fulfilled",
        },
      });

      orders.reverse().forEach(this.emitEvent);
    },
    emitEvent(body) {
      const data = body?.data?.order ?? body;

      if (data.status !== "fulfilled") {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New order fulfilled with id ${data.id}`,
        ts: Date.parse(data.updated),
      });
    },
  },
};
