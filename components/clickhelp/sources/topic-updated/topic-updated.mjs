import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickhelp-topic-updated",
  name: "Topic Updated",
  description: "Emit new event when a topic is updated. [See the documentation](https://clickhelp.com/software-documentation-tool/user-manual/api-get-all-topics-from-project.html)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(item) {
      return item.createdOn !== item.modifiedOn;
    },
    getTsField() {
      return "modifiedOn";
    },
    getResourceFn() {
      return this.clickhelp.listTopics;
    },
    generateMeta(topic) {
      const ts = Date.parse(topic.modifiedOn);
      return {
        id: `${topic.id}-${ts}`,
        summary: `Topic Updated with ID ${topic.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
