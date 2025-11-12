import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickhelp-new-topic-created",
  name: "New Topic Created",
  description: "Emit new event when a topic is created. [See the documentation](https://clickhelp.com/software-documentation-tool/user-manual/api-get-all-topics-from-project.html)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "createdOn";
    },
    getResourceFn() {
      return this.clickhelp.listTopics;
    },
    generateMeta(topic) {
      return {
        id: topic.id,
        summary: `New Topic with ID ${topic.id}`,
        ts: Date.parse(topic.createdOn),
      };
    },
  },
  sampleEmit,
};
