import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "helpspot-request-update",
  name: "New Request Updated",
  description: "Emit new event when a request is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary({ xRequest }) {
      return `New request updated: ${xRequest}`;
    },
    async getItems(maxResults, lastDate) {
      const { xRequest } = await this.helpspot.listChanges({
        params: {
          dtGMTChange: lastDate,
        },
      });

      if (!xRequest.length) return [];

      let { request: items } = await this.helpspot.multiGet({
        params: {
          xRequest,
        },
      });

      items.reverse();

      if (maxResults && items.length > maxResults) {
        items.length = maxResults;
      }

      const responseArray = [];

      for (const item of items) {
        item.lastDate = this._getMaxDate(item);
        responseArray.push(item);
      }

      return responseArray;
    },
  },
  sampleEmit,
};
