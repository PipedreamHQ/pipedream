import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "evernote-new-notebook",
  name: "New Notebook Created",
  description: "Emit new event when a notebook is created in Evernote.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New notebook created: ${item.name}`;
    },
    getData() {
      return this.evernote.listNotebooks();
    },
    prepareResults(results, lastData, maxResults) {
      results = results
        .filter((item) => item.serviceCreated > lastData)
        .sort((a, b) => b.serviceCreated - a.serviceCreated);

      if (results.length) {
        if (maxResults && (results.length > maxResults)) {
          results.length = maxResults;
        }
      }
      return results.reverse();
    },
    lastData(results) {
      return results[results.length - 1].serviceCreated;
    },
  },
  sampleEmit,
};
