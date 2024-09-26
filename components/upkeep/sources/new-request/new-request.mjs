import common from "../common/common.mjs";

export default {
  key: "upkeep-new-request",
  name: "New Request Event",
  description: "Emit new event when a request is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTitle() {
      return "Pipedream - New Request";
    },
    getEvents() {
      return [
        "REQUEST_CREATED",
      ];
    },
    getSummary(item) {
      return `New request (ID:${item?.id}, TITLE:${item?.title})`;
    },
    getTime(item) {
      return item?.createdAt ?
        new Date(item?.createdAt).getTime() :
        new Date().getTime();
    },
    getHistoricalEventsFn() {
      return this.app.getRequests;
    },
  },
};
