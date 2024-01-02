import common from "../common/base.mjs";

export default {
  ...common,
  key: "bugbug-new-cloud-suite-run-failed",
  name: "New Cloud Suite Run Failed",
  description: "Emit new event when any suite fails when running in BugBug Cloud",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    suite: {
      propDefinition: [
        common.props.bugbug,
        "suite",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getRelevantRuns(runs = []) {
      const relevantRuns = [];
      for (const run of runs) {
        if (run.runMode !== "server" || !run.suiteRunId) {
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
