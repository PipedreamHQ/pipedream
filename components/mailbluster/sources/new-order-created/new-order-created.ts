import { defineSource } from "@pipedream/types";
import moment from "moment";
import common from "../common/base";

export default defineSource({
  ...common,
  key: "mailbluster-new-order-created",
  name: "New Order Created",
  description: "Emit new event when a new order is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.mailbluster.listOrders;
    },
    getField() {
      return "orders";
    },
    validateKeys(key1: string|number, key2: string|number) {
      return moment(key1).isAfter(key2);
    },
  },
});
