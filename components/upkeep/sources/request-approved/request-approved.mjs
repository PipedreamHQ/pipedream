import common from "../common/common.mjs";

export default {
  key: "upkeep-request-approved",
  name: "New Request Approved Event",
  description: "Emit new event when a request is approved.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
    getTitle() {
      return "Pipedream - Request Approved";
    },
    getEvents() {
      return [
        "REQUEST_APPROVED",
      ];
    },
    getSummarry(item) {
      return `Request(ID:${item?.id}, TITLE:${item?.title}) has been approved at ${item?.updatedAt}`;
    },
    getTime(item) {
      return item?.updatedAt ?
        new Date(item?.updatedAt).getTime() :
        new Date().getTime();
    },
  },
};
