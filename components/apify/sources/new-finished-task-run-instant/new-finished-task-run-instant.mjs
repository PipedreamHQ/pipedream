import apify from "../../apify.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "apify-new-finished-task-run-instant",
  name: "New Finished Task Run",
  description: "Emits an event when a selected task is run and finishes. [See the documentation](https://docs.apify.com/api/v2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    apify,
    db: "$.service.db",
    taskId: {
      propDefinition: [
        apify,
        "taskId",
      ],
    },
    runStatus: {
      propDefinition: [
        apify,
        "runStatus",
        (c) => ({
          optional: true,
        }),
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // Check every minute
      },
    },
  },
  methods: {
    isTargetStatus(runStatus, targetStatus) {
      // If targetStatus is not defined, consider any status as target
      if (!targetStatus) return true;
      return runStatus === targetStatus;
    },
  },
  async run() {
    const lastRunId = this.db.get("lastRunId") || null;
    let newLastRunId = lastRunId;
    let nextPage = 1;
    let hasMore = true;

    while (hasMore) {
      const { data } = await this.apify._makeRequest({
        path: `/actor-tasks/${this.taskId}/runs?desc=true&limit=100&offset=${(nextPage - 1) * 100}`,
      });

      if (!data || data.length === 0) {
        hasMore = false;
        break;
      }

      for (const run of data.items) {
        if (run.id === lastRunId) {
          hasMore = false;
          break;
        }

        if (this.isTargetStatus(run.status, this.runStatus)) {
          this.$emit(run, {
            id: run.id,
            summary: `Task Run ${run.id} finished with status: ${run.status}`,
            ts: Date.parse(run.finishedAt),
          });

          if (!newLastRunId) newLastRunId = run.id; // Update last run id with the first new run id
        }
      }

      if (data.total <= nextPage * 100) {
        hasMore = false;
      } else {
        nextPage++;
      }
    }

    if (newLastRunId) this.db.set("lastRunId", newLastRunId);
  },
};
