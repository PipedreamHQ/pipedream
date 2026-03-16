import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nutshell-lead-won",
  name: "New Lead Won",
  description: "Emit new event when a lead is won.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMethod() {
      return "findLeads";
    },
    getSummary({
      name, id,
    }) {
      return `New Lead Won: ${name || id}`;
    },
    getQuery() {
      return {
        status: 10,
      };
    },
    async prepareData({
      data, lastData, maxResults,
    }) {
      let responseArray = [];
      for await (const item of data) {
        responseArray.push(item);
      }
      responseArray = responseArray
        .filter((item) => (Date.parse(item.closedTime) > Date.parse(lastData) ))
        .sort((a, b) => Date.parse(b.closedTime) - Date.parse(a.closedTime));

      if (responseArray.length) this._setLastData(responseArray[0].closedTime);
      if (maxResults && (responseArray.length > maxResults)) responseArray.length = maxResults;
      return responseArray;
    },
  },
  sampleEmit,
};
