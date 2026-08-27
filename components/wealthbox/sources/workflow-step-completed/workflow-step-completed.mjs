// x-pd-ai: optimized
import { createHash } from "crypto";
import common from "../common/common.mjs";
import { DEFAULT_HISTORICAL_LIMIT } from "../../common/constants.mjs";

const MAX_ID_LENGTH = 64;
const MAX_PAGES = 40;

export default {
  ...common,
  key: "wealthbox-workflow-step-completed",
  name: "Workflow Step Completed",
  description: "Emit new event each time workflow step activity is recorded in Wealthbox. The Wealthbox workflow step object has no completion flag of its own, so this polls the account Activity Stream (GET /activity) filtered to WorkflowStep-linked items. Deduplicates by activity stream item id (not step id), so reverting and re-completing the same step correctly emits a new event each time. [See the documentation](https://dev.wealthbox.com/#activity-stream-retrieve-activity-stream-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getLastUpdated() {
      return this.db.get("lastUpdated");
    },
    _setLastUpdated(ts) {
      this.db.set("lastUpdated", ts);
    },
    isCompletionActivity(item) {
      return item.linked_to?.type === "WorkflowStep";
    },
    async fetchCompletionActivity(since) {
      const params = {
        type: "WorkflowStep",
      };
      if (since > 0) {
        params.updated_since = new Date(since * 1000).toISOString();
      }

      // The Activity Stream endpoint paginates via `cursor`, not the
      // per_page/page convention used elsewhere in this API - Wealthbox's own
      // docs mark page-based pagination as deprecated for this endpoint. There's
      // no documented "next cursor" response field, so we advance using the
      // last item's id; if that assumption is ever wrong, the loop just
      // re-fetches the same page until MAX_PAGES, and Pipedream's own dedupe
      // (by activity item id) prevents any duplicate emits either way.
      let cursor;
      const allItems = [];
      for (let page = 0; page < MAX_PAGES; page++) {
        const response = await this.wealthbox.listActivityStream({
          params: {
            ...params,
            cursor,
          },
        });
        const streamItems = response?.stream_items || [];
        if (!streamItems.length) {
          break;
        }
        allItems.push(...streamItems);
        cursor = streamItems[streamItems.length - 1].id;
      }

      return allItems.filter((item) => {
        if (!item.updated_at || !this.isCompletionActivity(item)) {
          return false;
        }
        return (Date.parse(item.updated_at) / 1000) > since;
      });
    },
    generateMeta(item) {
      const rawId = `${item.id}`;
      const id = rawId.length <= MAX_ID_LENGTH
        ? rawId
        : createHash("sha256").update(rawId)
          .digest("hex");
      return {
        id,
        summary: `Workflow Step Completed: ${item.linked_to?.name || item.linked_to?.id || item.id}`,
        ts: Date.parse(item.updated_at),
      };
    },
    // Not used directly - workflow-step-completed overrides run() and hooks.deploy
    getEvents() {
      return [];
    },
  },
  hooks: {
    async deploy() {
      const items = await this.fetchCompletionActivity(0);
      const recent = items.slice(0, DEFAULT_HISTORICAL_LIMIT);
      if (!recent.length) {
        return;
      }
      let maxTs = 0;
      for (const item of recent) {
        this.$emit(item, this.generateMeta(item));
        const ts = Date.parse(item.updated_at) / 1000;
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
      this._setLastUpdated(maxTs);
    },
  },
  async run() {
    const lastUpdated = this._getLastUpdated() || 0;
    let maxUpdated = lastUpdated;

    const items = await this.fetchCompletionActivity(lastUpdated);
    for (const item of items) {
      this.$emit(item, this.generateMeta(item));
      const ts = Date.parse(item.updated_at) / 1000;
      if (ts > maxUpdated) {
        maxUpdated = ts;
      }
    }

    this._setLastUpdated(maxUpdated);
  },
};
