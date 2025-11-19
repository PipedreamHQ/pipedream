import common from "../common/base.mjs";

export default {
  ...common,
  key: "upgrade_chat-new-order-created",
  name: "New Order Created",
  description: "Emit new events when a order is created. [See the documentation](https://upgrade.chat/developers/documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.upgradeChat.listOrders;
    },
    getSummary(order) {
      return `Order ${order.id} created`;
    },
  },
};
