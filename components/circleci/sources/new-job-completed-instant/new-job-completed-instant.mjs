import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "circleci-new-job-completed-instant",
  name: "New Job Completed (Instant)",
  description: "Emit new event when a job is completed in CircleCI.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "job-completed",
      ];
    },
    getSummary(event) {
      return `Job Completed: ${event.job.name}`;
    },
  },
  sampleEmit,
};
