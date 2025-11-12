import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "circleci-new-workflow-completed-instant",
  name: "New Workflow Completed (Instant)",
  description: "Emit new event when a workflow is completed in CircleCI.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "workflow-completed",
      ];
    },
    getSummary(event) {
      return `Workflow Completed: ${event.workflow.name}`;
    },
  },
  sampleEmit,
};
