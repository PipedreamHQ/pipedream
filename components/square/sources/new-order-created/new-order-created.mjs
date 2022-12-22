import base from "../common/base.mjs";

export default {
  ...base,
  key: "square-new-order-created",
  name: "New Order Created",
  description: "Emit new event for every new order created",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log("Retrieving at most last 25...");
    },
  },
  methods: {
    ...base.methods,
    getEventTypes() {
      return [
        "order.created",
      ];
    },
    getSummary(event) {
      return `Order created: ${event.data.id}`;
    },
    getTimestamp(event) {
      return new Date(event.data.object.order_created.created_at);
    },
  },
};
