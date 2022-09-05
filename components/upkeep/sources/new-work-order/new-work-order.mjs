import common from "../common/common.mjs";

export default {
  key: "upkeep-new-work-order",
  name: "New Work Order Event",
  description: "Emit new event when a work order is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTitle() {
      return "Pipedream - New Work Order";
    },
    getEvents() {
      return [
        "WORK_ORDER_CREATED",
      ];
    },
    getSummary(item) {
      return `New work order(ID:${item?.id}, TITLE:${item?.title})`;
    },
    getTime(item) {
      return item?.createdAt ?
        new Date(item?.createdAt).getTime() :
        new Date().getTime();
    },
    getHistoricalEventsFn() {
      return this.app.getWorkOrders;
    },
  },
};
