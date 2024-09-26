import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "little_green_light-new-constituent-created",
  name: "New Constituent Created",
  description: "Emit new event for each new constituent created in Little Green Light.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async generateMeta(constituent) {
      return {
        id: constituent.id,
        summary: `New Constituent: ${constituent.first_name} ${constituent.last_name}`,
        ts: Date.parse(constituent.created_at),
      };
    },
    getFn() {
      return this.littleGreenLight.searchConstituents;
    },
    async prepareDate(data, lastData, maxResults) {
      let responseArray = [];
      for await (const item of data) {
        responseArray.push(item);
      }

      responseArray = responseArray.sort(
        (a, b) => b.id - a.id,
      );
      responseArray = responseArray.filter((item) => item.id > lastData);
      if (maxResults && (responseArray.length > maxResults)) responseArray.length = maxResults;
      if (responseArray.length) this._setLastData(responseArray[0].id);
      return responseArray;
    },
  },
  sampleEmit,
};
