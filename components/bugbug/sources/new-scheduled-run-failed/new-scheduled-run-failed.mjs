import common from "../common/base.mjs";

export default {
  ...common,
  key: "bugbug-new-scheduled-run-failed",
  name: "New Scheduled Run Failed",
  description: "Emit new event when any scheduled cloud run fails",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRelevantRuns(runs = []) {
      return runs.filter((run) => run.status === "failed" && run.triggeredBy === "scheduler");
    },
  },
};
