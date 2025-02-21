import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "langfuse-new-score-received",
  name: "New Score Received",
  description: "Emit new event when user feedback (score) is submitted on a trace in Langfuse. [See the documentation](https://api.reference.langfuse.com/#tag/score/GET/api/public/scores).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listScores;
    },
    getResourcesFnArgs() {
      return {
        params: {
          orderBy: "createdAt.desc",
          fromTimestamp: this.getLastDateAt(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Score: ${resource.name}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
  sampleEmit,
};
