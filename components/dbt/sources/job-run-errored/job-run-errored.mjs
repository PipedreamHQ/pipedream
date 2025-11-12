import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dbt-job-run-errored",
  name: "Job Run Errored (Instant)",
  description: "Emit new event when a job run has errored.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "job.run.errored",
      ];
    },
    generateMeta(body) {
      return {
        id: body.eventId,
        summary: `Job "${body.data.jobName}" errored`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
