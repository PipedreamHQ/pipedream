import { axios } from "@pipedream/platform";
import postman from "../../postman.app.mjs";

export default {
  key: "postman-test-suite-completed",
  name: "Test Suite Completed",
  description: "Emit an event when a test suite is completed. [See the documentation](https://learning.postman.com/docs/running-collections/intro-to-collection-runs/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    postman,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    collectionId: {
      propDefinition: [
        postman,
        "collectionId",
      ],
    },
    environmentId: {
      propDefinition: [
        postman,
        "environmentId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const initialRun = await this.postman.runCollection(this.collectionId, this.environmentId);
      for (const run of initialRun.runs.slice(-50)) {
        this.$emit(run, {
          id: run.id,
          summary: `Test Suite Completed: ${run.name}`,
          ts: Date.parse(run.createdAt),
        });
      }
      this.db.set("lastRunId", initialRun.runs[initialRun.runs.length - 1].id);
    },
  },
  methods: {
    async getLatestRun() {
      const lastRunId = this.db.get("lastRunId");
      const runs = await this.postman.listRuns(this.collectionId);

      const newRuns = runs.filter((run) => run.id !== lastRunId && run.status === "finished");
      if (newRuns.length > 0) {
        const latestRun = newRuns.reduce((max, run) => run.createdAt > max.createdAt
          ? run
          : max, newRuns[0]);
        return latestRun;
      }

      return null;
    },
  },
  async run() {
    const latestRun = await this.getLatestRun();

    if (latestRun) {
      this.$emit(latestRun, {
        id: latestRun.id,
        summary: `Test Suite Completed: ${latestRun.name}`,
        ts: Date.parse(latestRun.createdAt),
      });
      this.db.set("lastRunId", latestRun.id);
    }
  },
};
