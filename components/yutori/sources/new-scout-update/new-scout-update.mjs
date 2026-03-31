import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import yutori from "../../yutori.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "yutori-new-scout-update",
  name: "New Scout Update",
  description: "Emit new findings from your Yutori Scouts. Scouts are recurring web monitors that watch prices, news, competitors, job postings, or anything else on the web. Use this as the companion trigger for the **Create Scout** action — start workflows that react to scout results (e.g. send a Slack message, update a Google Sheet, or post to Notion whenever a scout finds something new).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  annotations: {
    openWorldHint: false,
    destructiveHint: false,
    readOnlyHint: true,
  },
  props: {
    yutori,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    hoursBack: {
      type: "integer",
      label: "Initial Lookback (hours)",
      description: "On first run, how many hours back to check for existing updates. Set to 0 to only emit new updates going forward.",
      optional: true,
      default: 24,
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") ?? null;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  async run() {
    let sinceTimestamp = this._getLastTimestamp();

    // On first run, look back by hoursBack
    if (sinceTimestamp == null) {
      const hoursBack = this.hoursBack ?? 24;
      sinceTimestamp = hoursBack > 0
        ? Date.now() - hoursBack * 60 * 60 * 1000
        : Date.now();
    }

    const now = Date.now();
    // Collect all pages so bursts don't silently drop updates.
    const updates = [];
    let cursor = undefined;
    const seenCursors = new Set();
    const MAX_PAGES = 100;
    let pages = 0;
    let paginationTruncated = false;
    do {
      if (pages++ >= MAX_PAGES) {
        paginationTruncated = true;
        break;
      }
      if (cursor && seenCursors.has(cursor)) break;
      if (cursor) seenCursors.add(cursor);

      const response = await this.yutori.getUpdates(this, {
        start_time: new Date(sinceTimestamp).toISOString(),
        end_time: new Date(now).toISOString(),
        ...(cursor
          ? {
            cursor,
          }
          : {}),
      });
      const page = response?.updates ?? [];
      updates.push(...page);
      cursor = response?.next_cursor ?? null;
    } while (cursor);

    // Emit oldest first so downstream steps process in chronological order
    for (let i = updates.length - 1; i >= 0; i--) {
      const update = updates[i];
      this.$emit(update, {
        id: update.id,
        summary: `[${update.scout_display_name}] ${String(update.content || "").slice(0, 80)}`,
        ts: update.timestamp,
      });
    }

    // Only advance lastTimestamp when pagination completed fully.
    // If truncated, leave it unchanged so the next run retries from the same window.
    if (!paginationTruncated) {
      if (updates.length > 0) {
        // updates[0] is the newest (API returns reverse-chronological order)
        this._setLastTimestamp(updates[0].timestamp + 1);
      } else {
        this._setLastTimestamp(now);
      }
    }
  },
  sampleEmit,
};
