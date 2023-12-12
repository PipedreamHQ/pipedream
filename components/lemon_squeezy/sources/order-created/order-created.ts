import { defineSource } from "@pipedream/types";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "lemon_squeezy-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.lemonSqueezy.listOrders;
    },
    getSummary({ id }): string {
      return `A new order with id ${id} was created!`;
    },
  },
});
