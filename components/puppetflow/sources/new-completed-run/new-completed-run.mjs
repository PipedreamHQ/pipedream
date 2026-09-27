import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import puppetflow from "../../puppetflow.app.mjs";
import { TERMINAL_RUN_STATUSES } from "../../common/constants.mjs";

const INITIAL_EVENTS = 25;
const COMPLETION_LOOKBACK_MS = 24 * 60 * 60 * 1000;

export default {
  key: "puppetflow-new-completed-run",
  name: "New Completed Run",
  description: "Emit new event when a Puppetflow run finishes with status `success`, `error` or `cancelled`, for one flow or for every flow visible to the API key."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/runs#search-runs-across-flows)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    puppetflow,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the Puppetflow API on this schedule",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    flowId: {
      propDefinition: [
        puppetflow,
        "flowId",
      ],
      description: "Only emit runs of this flow, e.g. `flow_k8Zt3xQ9mA2f`. Leave empty to watch every flow the API key can access."
        + " Use **List Flows** to find it (the `id` field).",
      optional: true,
    },
  },
  methods: {
    _getLastUpdatedAt() {
      return this.db.get("lastUpdatedAt") ?? 0;
    },
    _setLastUpdatedAt(value) {
      this.db.set("lastUpdatedAt", value);
    },
    generateMeta(run) {
      return {
        id: run.id,
        summary: `Run #${run.id} of flow ${run.flow_id} finished with status ${run.status}`,
        ts: Date.parse(run.updated_at),
      };
    },
    emitRuns(runs) {
      const lastUpdatedAt = this._getLastUpdatedAt();
      let maxUpdatedAt = lastUpdatedAt;
      for (const run of runs.reverse()) {
        this.$emit(run, this.generateMeta(run));
        maxUpdatedAt = Math.max(maxUpdatedAt, Date.parse(run.updated_at));
      }
      if (maxUpdatedAt > lastUpdatedAt) {
        this._setLastUpdatedAt(maxUpdatedAt);
      }
    },
    async getCompletedRuns({
      max, since,
    }) {
      const runs = [];
      const items = this.puppetflow.paginate({
        fn: this.puppetflow.searchAllRuns,
        args: {
          params: {
            flow_id: this.flowId,
            statuses: TERMINAL_RUN_STATUSES,
          },
        },
        max,
      });
      for await (const run of items) {
        if (since && Date.parse(run.created_at) < since - COMPLETION_LOOKBACK_MS) {
          break;
        }
        if (!since || Date.parse(run.updated_at) > since) {
          runs.push(run);
        }
      }
      return runs;
    },
  },
  hooks: {
    async deploy() {
      const runs = await this.getCompletedRuns({
        max: INITIAL_EVENTS,
      });
      this.emitRuns(runs);
    },
  },
  async run() {
    const since = this._getLastUpdatedAt();
    const runs = await this.getCompletedRuns({
      since,
      max: since
        ? undefined
        : INITIAL_EVENTS,
    });
    if (!runs.length) {
      return;
    }
    this.emitRuns(runs);
  },
};
