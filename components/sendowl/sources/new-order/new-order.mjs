import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Order",
  version: "0.0.1",
  key: "sendowl-new-order",
  description: "Emit new event for each order.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      const { order } = data;

      this.$emit(data, {
        id: order.id,
        summary: `New order with id ${order.id}`,
        ts: Date.parse(order.created_at),
      });
    },
    async getResources(args = {}) {
      return this.sendowl.getOrders({
        ...args,
        params: {
          ...args.params,
          state: [
            "subscription_active",
            "complete",
          ],
        },
      });
    },
  },
};
