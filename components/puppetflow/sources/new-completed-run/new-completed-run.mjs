import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import puppetflow from "../../puppetflow.app.mjs";
import { TERMINAL_RUN_STATUSES } from "../../common/constants.mjs";

const INITIAL_EVENTS = 25;

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
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt") ?? 0;
    },
    _setLastCreatedAt(value) {
      this.db.set("lastCreatedAt", value);
    },
    _getPendingRuns() {
      return this.db.get("pendingRuns") ?? [];
    },
    _setPendingRuns(value) {
      this.db.set("pendingRuns", value);
    },
    _getCursorRunIds() {
      return this.db.get("cursorRunIds") ?? [];
    },
    _setCursorRunIds(value) {
      this.db.set("cursorRunIds", value);
    },
    isTerminal(run) {
      return TERMINAL_RUN_STATUSES.includes(run.status);
    },
    generateMeta(run) {
      return {
        id: run.id,
        summary: `Run #${run.id} of flow ${run.flow_id} finished with status ${run.status}`,
        ts: Date.parse(run.updated_at),
      };
    },
    emitRuns(runs) {
      runs
        .sort((a, b) => Date.parse(a.updated_at) - Date.parse(b.updated_at))
        .forEach((run) => this.$emit(run, this.generateMeta(run)));
    },
    /**
     * Fetches the runs created after the stored cursor. The API returns runs sorted by
     * creation time, most recent first, so pagination can stop at the first run created
     * before the cursor.
     */
    async getRunsCreatedSince(since, max) {
      const runs = [];
      const items = this.puppetflow.paginate({
        fn: this.puppetflow.searchAllRuns,
        args: {
          params: {
            flow_id: this.flowId,
          },
        },
        max,
      });
      for await (const run of items) {
        if (Date.parse(run.created_at) < since) {
          break;
        }
        runs.push(run);
      }
      return runs;
    },
    /**
     * Re-checks runs that were still in progress on a previous poll and returns the ones
     * that have finished since, along with the ones still pending.
     */
    async settlePendingRuns(pendingRuns) {
      const completed = [];
      const stillPending = [];
      for (const pending of pendingRuns) {
        const run = await this.puppetflow.getRun({
          flowId: pending.flow_id,
          runId: pending.id,
        });
        if (this.isTerminal(run)) {
          completed.push(run);
        } else {
          stillPending.push(pending);
        }
      }
      return {
        completed,
        stillPending,
      };
    },
    async processEvent({
      max, since,
    }) {
      const knownPending = this._getPendingRuns();
      // Runs created exactly at the cursor timestamp are fetched again on the next poll,
      // so the ones already processed are remembered to avoid emitting them twice.
      const knownIds = new Set([
        ...knownPending.map(({ id }) => id),
        ...this._getCursorRunIds(),
      ]);

      const recentRuns = await this.getRunsCreatedSince(since, max);
      const newRuns = recentRuns.filter(({ id }) => !knownIds.has(id));
      const completed = newRuns.filter((run) => this.isTerminal(run));
      const newPending = newRuns
        .filter((run) => !this.isTerminal(run))
        .map(({
          id, flow_id: flowId,
        }) => ({
          id,
          flow_id: flowId,
        }));

      const settled = await this.settlePendingRuns(knownPending);
      completed.push(...settled.completed);

      const lastCreatedAt = Math.max(since, ...recentRuns.map((run) => Date.parse(run.created_at)));
      const cursorRunIds = recentRuns
        .filter((run) => Date.parse(run.created_at) === lastCreatedAt)
        .map(({ id }) => id);
      this._setPendingRuns([
        ...settled.stillPending,
        ...newPending,
      ]);
      this._setCursorRunIds(lastCreatedAt === since
        ? [
          ...new Set([
            ...this._getCursorRunIds(),
            ...cursorRunIds,
          ]),
        ]
        : cursorRunIds);
      this._setLastCreatedAt(lastCreatedAt);

      if (!completed.length) {
        return;
      }
      this.emitRuns(completed);
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent({
        since: 0,
        max: INITIAL_EVENTS,
      });
    },
  },
  async run() {
    const since = this._getLastCreatedAt();
    await this.processEvent({
      since,
      max: since
        ? undefined
        : INITIAL_EVENTS,
    });
  },
};
