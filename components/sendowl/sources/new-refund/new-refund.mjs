import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Refund",
  version: "0.0.1",
  key: "sendowl-new-refund",
  description: "Emit new event for each refund.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      const { order } = data;

      if (!order.refunded) {
        return;
      }

      this.$emit(data, {
        id: order.id,
        summary: `New refund with id ${order.id}`,
        ts: Date.parse(order.created_at),
      });
    },
    async getResources(args = {}) {
      return this.sendowl.getOrders(args);
    },
  },
};
