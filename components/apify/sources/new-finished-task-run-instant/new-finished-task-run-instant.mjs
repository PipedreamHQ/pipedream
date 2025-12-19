import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "apify-new-finished-task-run-instant",
  name: "New Finished Task Run (Instant)",
  description: "Emit new event when a selected task is run and finishes.",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    taskId: {
      propDefinition: [
        common.props.apify,
        "taskId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getCondition() {
      return {
        actorTaskId: this.taskId,
      };
    },
    getSummary(body) {
      return `A new task run ${body.eventData.actorRunId} has finished`;
    },
  },
  sampleEmit,
};
