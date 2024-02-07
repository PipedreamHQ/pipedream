import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "omnisend-new-order-completed",
  name: "New Order Completed",
  description: "Emit new event for each new completed order in Omnisend.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(contact) {
      return `New Order with ID: ${contact.orderID}`;
    },
    getFunction() {
      return this.omnisend.listOrders;
    },
    getDataField() {
      return "orders";
    },
    filterArray(item, lastId) {
      return (Date.parse(item.createdAt) > Date.parse(lastId) && (item.fulfillmentStatus === "fulfilled"));
    },
  },
  sampleEmit,
};
