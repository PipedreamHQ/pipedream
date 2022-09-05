import common from "../common/common.mjs";

export default {
  key: "upkeep-work-order-status-change",
  name: "New Work Order Status Change Event",
  description: "Emit new event when a work order status is changed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTitle() {
      return "Pipedream - Work Order Status Change";
    },
    getEvents() {
      return [
        "WORK_ORDER_STATUS_UPDATED",
      ];
    },
    getSummary(item) {
      return `Work order(ID:${item?.id}, TITLE:${item?.title}) status has been changed to ${item?.status}`;
    },
    getTime(item) {
      return item?.updatedAt ?
        new Date(item?.updatedAt).getTime() :
        new Date().getTime();
    },
    getHistoricalEventsFn() {
      return this.app.getWorkOrders;
    },
  },
};
