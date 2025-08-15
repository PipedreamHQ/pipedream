import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sevdesk-new-order",
  name: "New Order Created",
  description: "Emit new event for each new order created in SevDesk.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.sevdesk.listOrders;
    },
    getSummary(data) {
      return `New order created with Id: ${data.id}`;
    },
  },
  sampleEmit,
};
