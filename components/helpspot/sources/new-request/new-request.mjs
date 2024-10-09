import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "helpspot-new-request",
  name: "New Request Created",
  description: "Emit new event when a new request is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary({ xRequest }) {
      return `New Request: ${xRequest}`;
    },
    async getItems(maxResults, lastDate) {
      const responseArray = [];

      const response = this.helpspot.paginate({
        fn: this.helpspot.listRequests,
        field: "request",
        params: {
          afterDate: lastDate,
        },
        maxResults,
      });

      for await (const item of response) {
        item.lastDate = Date.parse(item.dtGMTOpened) / 1000;
        responseArray.push(item);
      }
      return responseArray;
    },
  },
  sampleEmit,
};
