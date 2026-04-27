import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "papertrail-new-group",
  name: "New Group",
  description: "Emit new event when a log group is created in your account. [See the documentation](https://www.papertrail.com/help/settings-api/#list-groups)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New group created: ${item.name}`;
    },
    async prepareResults(lastData, maxResults) {
      let groups = await this.papertrail.listGroups();
      groups = groups
        .filter((item) => item.id > lastData)
        .sort((a, b) => b.id - a.id);

      if (groups.length) {
        if (maxResults && (groups.length > maxResults)) {
          groups.length = maxResults;
        }
      }
      return groups.reverse();
    },
  },
  sampleEmit,
};
