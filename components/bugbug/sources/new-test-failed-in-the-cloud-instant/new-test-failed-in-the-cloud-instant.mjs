import bugbug from "../../bugbug.app.mjs";

export default {
  key: "bugbug-new-test-failed-in-the-cloud-instant",
  name: "New Test Failed in the Cloud (Instant)",
  description: "Emits a new event when any test failed when running in the bugbug cloud.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bugbug,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    test: {
      propDefinition: [
        bugbug,
        "test",
      ],
    },
  },
  hooks: {
    async deploy() {
      const failedRuns = await this.bugbug.getFailedTest(this.test);
      if (failedRuns.length > 0) {
        for (const run of failedRuns) {
          this.$emit(run, {
            id: run.id,
            summary: `Test ${this.test} failed on run ${run.id}`,
            ts: Date.parse(run.timestamp),
          });
        }
      }
    },
  },
  async run() {
    const failedRuns = await this.bugbug.getFailedTest(this.test);
    if (failedRuns.length > 0) {
      for (const run of failedRuns) {
        this.$emit(run, {
          id: run.id,
          summary: `Test ${this.test} failed on run ${run.id}`,
          ts: Date.parse(run.timestamp),
        });
      }
    }
  },
};
