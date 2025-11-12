import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dbt-job-run-started",
  name: "Job Run Started (Instant)",
  description: "Emit new event when a job run has started.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "job.run.started",
      ];
    },
    generateMeta(body) {
      return {
        id: body.eventId,
        summary: `Job "${body.data.jobName}" started`,
        ts: Date.parse(body.data.runStartedAt),
      };
    },
  },
  sampleEmit,
};
