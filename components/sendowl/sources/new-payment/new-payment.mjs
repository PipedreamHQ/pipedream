import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Payment",
  version: "0.0.2",
  key: "sendowl-new-payment",
  description: "Emit new event for each payment.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      const { order } = data;

      this.$emit(data, {
        id: order.id,
        summary: `New payment with id ${order.id}`,
        ts: Date.parse(order.created_at),
      });
    },
    async getResources(args = {}) {
      return this.sendowl.getOrders(args);
    },
  },
};
