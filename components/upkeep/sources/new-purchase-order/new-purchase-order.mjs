import common from "../common/common.mjs";

export default {
  key: "upkeep-new-purchase-order",
  name: "New Purchase Order Event",
  description: "Emit new event when a purchase order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTitle() {
      return "Pipedream - New Purchase Order";
    },
    getEvents() {
      return [
        "PURCHASE_ORDER_CREATED",
      ];
    },
    getSummary(item) {
      return `New purchase order(ID:${item?.id}, TITLE:${item?.title})`;
    },
    getTime(item) {
      return item?.createdAt ?
        new Date(item?.createdAt).getTime() :
        new Date().getTime();
    },
    getHistoricalEventsFn() {
      return this.app.getPurchaseOrders;
    },
  },
};
