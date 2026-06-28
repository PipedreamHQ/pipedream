import rendex from "../../rendex.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "rendex-new-change-detected",
  name: "New Change Detected",
  description: "Emit a new event each time a Rendex watch run detects a change. [See the documentation](https://rendex.dev/docs/watch#how-you-get-alerted).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    rendex,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    watchId: {
      propDefinition: [
        rendex,
        "watchId",
      ],
      optional: true,
      description: "Limit to a single watch. Leave blank to watch every watch on the account.",
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    _runTs(run) {
      return Date.parse(run.completedAt || run.createdAt) || 0;
    },
    async _watchIds() {
      if (this.watchId) {
        return [
          this.watchId,
        ];
      }
      const { data } = await this.rendex.listWatches({
        params: {
          status: "all",
          limit: 100,
        },
      });
      return (data?.items ?? []).map((watch) => watch.id);
    },
    async _changedRuns() {
      const watchIds = await this._watchIds();
      const runs = [];
      for (const watchId of watchIds) {
        const { data } = await this.rendex.listRuns(watchId, {
          params: {
            limit: 100,
          },
        });
        for (const run of data?.items ?? []) {
          if (run.status === "completed" && run.changed === true) {
            runs.push({
              ...run,
              watchId,
            });
          }
        }
      }
      return runs;
    },
    emitRun(run) {
      const detail = run.diffScore != null
        ? ` (diff ${run.diffScore})`
        : "";
      this.$emit(run, {
        id: run.id,
        summary: `Change detected on watch ${run.watchId}${detail}`,
        ts: this._runTs(run),
      });
    },
  },
  hooks: {
    async deploy() {
      // Surface up to the 5 most recent changes as sample events on deploy.
      const runs = (await this._changedRuns())
        .sort((a, b) => this._runTs(b) - this._runTs(a))
        .slice(0, 5)
        .reverse();
      let maxTs = this._getLastTs();
      for (const run of runs) {
        this.emitRun(run);
        maxTs = Math.max(maxTs, this._runTs(run));
      }
      this._setLastTs(maxTs);
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const runs = (await this._changedRuns())
      .filter((run) => this._runTs(run) > lastTs)
      .sort((a, b) => this._runTs(a) - this._runTs(b));

    let maxTs = lastTs;
    for (const run of runs) {
      this.emitRun(run);
      maxTs = Math.max(maxTs, this._runTs(run));
    }
    this._setLastTs(maxTs);
  },
};
