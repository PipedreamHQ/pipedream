import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dbt-job-run-completed",
  name: "Job Run Completed (Instant)",
  description: "Emit new event when a job run has completed.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "job.run.completed",
      ];
    },
    generateMeta(body) {
      return {
        id: body.eventId,
        summary: `Job "${body.data.jobName}"" completed`,
        ts: Date.parse(body.data.runFinishedAt),
      };
    },
  },
  sampleEmit,
};
