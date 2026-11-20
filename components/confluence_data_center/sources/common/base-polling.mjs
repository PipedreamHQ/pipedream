import confluenceDataCenter from "../../confluence_data_center.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

const PAGE_SIZE = 50;
const DEPLOY_EVENT_LIMIT = 25;
const OVERLAP_MS = 30 * 60 * 1000;

export default {
  props: {
    confluenceDataCenter,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    spaceKey: {
      propDefinition: [
        confluenceDataCenter,
        "spaceKey",
      ],
      description: "Only emit events for content in this space, identified by its space key (e.g. `DOCS`). Use **List Space Key Options** to find valid space keys (the `value` field). Leave blank to watch all spaces.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(DEPLOY_EVENT_LIMIT);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    _getSeen() {
      return this.db.get("seen") || {};
    },
    _setSeen(seen) {
      this.db.set("seen", seen);
    },
    getContentType() {
      throw new Error("getContentType is not implemented");
    },
    getOrderField() {
      throw new Error("getOrderField is not implemented");
    },
    getTs() {
      throw new Error("getTs is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    isRelevant() {
      return true;
    },
    getCql() {
      const clauses = [
        `type = "${this.getContentType()}"`,
      ];
      if (this.spaceKey) {
        clauses.push(`space = "${this.spaceKey.replace(/"/g, "\\\"")}"`);
      }
      return `${clauses.join(" AND ")} ORDER BY ${this.getOrderField()} DESC`;
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      // Without a stored cursor there is nothing to compare against, so never page through
      // the whole instance: fall back to the same bounded window deploy() uses.
      if (!lastTs && !max) {
        max = DEPLOY_EVENT_LIMIT;
      }
      // Confluence indexes content asynchronously, so an item can become visible in CQL
      // after a newer one. Keep reading back `OVERLAP_MS` behind the cursor and skip items
      // already handled (tracked in `seen`), so late-indexed items are still emitted.
      const cutoff = lastTs
        ? lastTs - OVERLAP_MS
        : 0;
      const seen = this._getSeen();
      const cql = this.getCql();
      const items = [];
      const skipped = [];
      let newestTs;
      let capped = false;
      let start = 0;
      let done = false;

      while (!done) {
        const { results = [] } = await this.confluenceDataCenter.searchContent({
          params: {
            cql,
            expand: "history,version,space",
            limit: PAGE_SIZE,
            start,
          },
        });

        for (const item of results) {
          const ts = this.getTs(item);
          // Results are newest-first, so the first one is the high-water mark even if
          // it is filtered out below (prevents a later run from backfilling everything).
          if (newestTs === undefined) {
            newestTs = ts;
          }
          // Older than the overlap window: everything after this has been handled.
          // Once the emit cap is hit, only keep reading far enough to mark the rest of
          // the window as seen, so it isn't back-filled by the next poll.
          const floor = capped
            ? Math.max(cutoff, newestTs - OVERLAP_MS)
            : cutoff;
          if (ts < floor) {
            done = true;
            break;
          }
          if (!this.isRelevant(item) || seen[this.generateMeta(item).id] !== undefined) {
            continue;
          }
          if (max && items.length >= max) {
            capped = true;
            skipped.push(item);
            continue;
          }
          items.push(item);
        }

        if (results.length < PAGE_SIZE) {
          done = true;
        }
        start += PAGE_SIZE;
      }

      // Emit oldest first.
      items.reverse().forEach((item) => {
        this.$emit(item, this.generateMeta(item));
      });

      // Persist state only after emitting, so a failed emit is retried on the next poll
      // (dedupe: "unique" drops any items that were already emitted).
      const newCursor = Math.max(lastTs, newestTs ?? 0);
      if (newCursor > lastTs) {
        this._setLastTs(newCursor);
      }

      // Remember what was handled (emitted or deliberately skipped by the cap) and drop
      // entries older than the window, which can never be read again.
      items.concat(skipped).forEach((item) => {
        seen[this.generateMeta(item).id] = this.getTs(item);
      });
      const keep = newCursor - OVERLAP_MS;
      Object.keys(seen).forEach((key) => {
        if (seen[key] < keep) {
          delete seen[key];
        }
      });
      this._setSeen(seen);
    },
  },
  async run() {
    await this.processEvents();
  },
};
