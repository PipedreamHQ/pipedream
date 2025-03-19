import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "evernote-new-tag",
  name: "New Tag Created",
  description: "Emit new event when a new tag is created in Evernote. Useful for tracking new organizational labels.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New tag created: ${item.name}`;
    },
    getData() {
      return this.evernote.listTags();
    },
    getDefaultData() {
      return [];
    },
    prepareResults(results, lastData, maxResults) {
      results = results.filter((item) => !lastData.includes(item.guid));

      if (results.length) {
        if (maxResults && (results.length > maxResults)) {
          results.length = maxResults;
        }
      }
      return results;
    },
    lastData(results) {
      return results[results.length - 1].created;
    },
  },
  sampleEmit,
};
