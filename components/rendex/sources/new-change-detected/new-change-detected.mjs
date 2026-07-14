import rendex from "../../rendex.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "rendex-new-change-detected",
  name: "New Change Detected",
  description: "Emit new event each time a Rendex watch run detects a change. [See the documentation](https://rendex.dev/docs/watch#how-you-get-alerted).",
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
      const ids = [];
      let cursor;
      do {
        const { data } = await this.rendex.listWatches({
          params: {
            status: "all",
            limit: 100,
            cursor,
          },
        });
        for (const watch of data?.items ?? []) {
          ids.push(watch.id);
        }
        cursor = data?.nextCursor;
      } while (cursor);
      return ids;
    },
    async _scanWatch(watchId, since, maxPages) {
      const runs = [];
      let maxTs = since;
      let cursor;
      let pages = 0;
      let reachedOld = false;
      do {
        const { data } = await this.rendex.listRuns(watchId, {
          params: {
            limit: 100,
            cursor,
          },
        });
        for (const run of data?.items ?? []) {
          const ts = this._runTs(run);
          if (ts <= since) {
            reachedOld = true;
            break;
          }
          if (ts > maxTs) {
            maxTs = ts;
          }
          if (run.status === "completed" && run.changed === true) {
            runs.push({
              ...run,
              watchId,
            });
          }
        }
        pages += 1;
        cursor = reachedOld || (maxPages && pages >= maxPages)
          ? null
          : data?.nextCursor;
      } while (cursor);
      return {
        runs,
        maxTs,
      };
    },
    async _scanChanges(since, maxPages) {
      const watchIds = await this._watchIds();
      const runs = [];
      let maxTs = since;
      for (const watchId of watchIds) {
        const scanned = await this._scanWatch(watchId, since, maxPages);
        runs.push(...scanned.runs);
        if (scanned.maxTs > maxTs) {
          maxTs = scanned.maxTs;
        }
      }
      return {
        runs,
        maxTs,
      };
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
      const {
        runs, maxTs,
      } = await this._scanChanges(0, 1);
      runs
        .sort((a, b) => this._runTs(b) - this._runTs(a))
        .slice(0, 5)
        .reverse()
        .forEach((run) => this.emitRun(run));
      this._setLastTs(maxTs);
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const {
      runs, maxTs,
    } = await this._scanChanges(lastTs);
    runs
      .sort((a, b) => this._runTs(a) - this._runTs(b))
      .forEach((run) => this.emitRun(run));
    this._setLastTs(maxTs);
  },
};
