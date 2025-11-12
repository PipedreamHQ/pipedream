import common from "../common/base.mjs";

export default {
  ...common,
  key: "bugbug-new-suite-run-failed",
  name: "New Suite Run Failed",
  description: "Emit new event when any suite fails when running in BugBug",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getRelevantRuns(runs = []) {
      const relevantRuns = [];
      for (const run of runs) {
        if (!run.suiteRunId) {
          continue;
        }
        const suiteRun = await this.bugbug.getSuiteRun({
          suiteRunId: run.suiteRunId,
        });
        if (suiteRun.status === "failed") {
          relevantRuns.push(suiteRun);
        }
      }
      return relevantRuns;
    },
  },
};
