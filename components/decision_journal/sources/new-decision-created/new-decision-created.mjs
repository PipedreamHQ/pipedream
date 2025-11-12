import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "decision_journal-new-decision-created",
  name: "New Decision Created",
  description: "Emit new event when a new decision is created. [See the documentation](https://openpm.ai/apis/decision-journal#/decisions)",
  version: "0.0.2",
  type: "source",
  dedupe: "last",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listDecisions;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Decision: ${resource.title}`,
        ts: Date.parse(resource.decisionDate),
      };
    },
  },
  sampleEmit,
};
