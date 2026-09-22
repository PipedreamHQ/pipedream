import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "papertrail-new-system",
  name: "New System",
  description:
    "Emit new event when a log sender (system) appears in your account. [See the documentation](https://www.papertrail.com/help/settings-api/#list-systems)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New system created: ${item.name}`;
    },
    async prepareResults(lastData, maxResults) {
      let results = await this.papertrail.listSystems();
      results = results
        .filter((item) => item.id > lastData)
        .sort((a, b) => b.id - a.id);

      if (results.length) {
        if (maxResults && (results.length > maxResults)) {
          results.length = maxResults;
        }
      }
      return results.reverse();
    },
  },
  sampleEmit,
};
