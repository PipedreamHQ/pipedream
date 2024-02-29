import common from "../common/common.mjs";

export default {
  key: "upkeep-purchase-order-status-change",
  name: "New Purchase Order Status Change Event",
  description: "Emit new event when a purchase order status is changed.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTitle() {
      return "Pipedream - Purchase Order Status Change";
    },
    getEvents() {
      return [
        "PURCHASE_ORDER_APPROVED",
        "PURCHASE_ORDER_DECLINED",
      ];
    },
    getSummary(item) {
      // eslint-disable-next-line multiline-ternary
      return `Purchase order(ID:${item?.id}, TITLE:${item?.title}) was ${item?.approvedAt ? "approved" : "declined"} at ${item?.approvedAt ?? item?.declinedAt}`;
    },
    getTime(item) {
      const date = item?.approvedAt || item?.declinedAt;
      return date ?
        new Date(date).getTime() :
        new Date().getTime();
    },
    getHistoricalEventsFn() {
      return this.app.getPurchaseOrders;
    },
  },
};
