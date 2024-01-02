import bugbug from "../../bugbug.app.mjs";

export default {
  key: "bugbug-new-cloud-suite-run-failed-instant",
  name: "New Cloud Suite Run Failed Instant",
  description: "Emits an event when any suite fails when running in bugbug cloud",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bugbug,
    suite: {
      propDefinition: [
        bugbug,
        "suite",
      ],
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, timestamp,
      } = data;
      return {
        id,
        summary: `Suite: ${this.suite} - Run Failed`,
        ts: Date.parse(timestamp),
      };
    },
  },
  hooks: {
    async deploy() {
      const failedRuns = await this.bugbug.getFailedSuite(this.suite);
      for (const run of failedRuns.slice(0, 50).reverse()) {
        this.$emit(run, {
          id: run.id,
          summary: `Suite Run Failed: ${run.suiteName}`,
          ts: Date.parse(run.createdAt),
        });
      }
    },
  },
  async run() {
    const failedRuns = await this.bugbug.getFailedSuite(this.suite);
    for (const run of failedRuns) {
      const meta = this.generateMeta(run);
      this.$emit(run, meta);
    }
  },
};
