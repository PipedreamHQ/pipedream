import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Subscription Termination",
  version: "0.0.1",
  key: "sendowl-new-subscription-termination",
  description: "Emit new event for each subscription termination.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      const { order } = data;

      this.$emit(data, {
        id: order.id,
        summary: `New subscription termination with id ${order.id}`,
        ts: Date.parse(order.created_at),
      });
    },
    async getResources(args = {}) {
      return this.sendowl.getOrders({
        ...args,
        params: {
          ...args.params,
          state: [
            "subscription_complete",
            "subscription_cancelled",
          ],
        },
      });
    },
  },
};
