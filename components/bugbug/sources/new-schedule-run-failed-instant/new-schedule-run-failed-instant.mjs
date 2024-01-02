import bugbug from "../../bugbug.app.mjs";

export default {
  key: "bugbug-new-schedule-run-failed-instant",
  name: "New Scheduled Run Failed (Instant)",
  description: "Emits a new event when any scheduled cloud run fails",
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
  },
  hooks: {
    async deploy() {
      // Get the last 50 failed cloud runs
      const failedRuns = await this.bugbug.getFailedCloudRuns();
      for (const run of failedRuns.slice(0, 50)) {
        this.$emit(run, {
          id: run.id,
          summary: `Cloud Run ID: ${run.id} failed`,
          ts: Date.parse(run.failedAt),
        });
      }
    },
  },
  async run() {
    // Get all failed cloud runs
    const failedRuns = await this.bugbug.getFailedCloudRuns();

    // Get last failed run id from db
    const lastFailedRunId = this.db.get("lastFailedRunId") || 0;

    for (const run of failedRuns) {
      if (run.id > lastFailedRunId) {
        // This is a new failed run, emit it
        this.$emit(run, {
          id: run.id,
          summary: `Cloud Run ID: ${run.id} failed`,
          ts: Date.parse(run.failedAt),
        });
      }
    }

    // Update the last failed run id in db
    if (failedRuns.length > 0) {
      this.db.set("lastFailedRunId", failedRuns[0].id);
    }
  },
};
