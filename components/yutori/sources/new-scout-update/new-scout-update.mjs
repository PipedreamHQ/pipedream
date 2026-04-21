import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import yutori from "../../yutori.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "yutori-new-scout-update",
  name: "New Scout Update",
  description: "Emit new findings from a Yutori Scout. Configure your scout once here — it is created automatically when this source is deployed and deleted when it is disabled. Each new finding emits an event you can act on with downstream steps (e.g. send a Slack message, update a Google Sheet, or post to Notion).",
  version: "0.1.0",
  type: "source",
  dedupe: "unique",
  props: {
    yutori,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    query: {
      propDefinition: [
        yutori,
        "query",
      ],
      label: "Monitoring Query",
      description: "What to monitor, e.g. `Alert me when AAPL stock drops below $200` or `Notify me when new Python engineer roles appear on Stripe's careers page`",
    },
    outputInterval: {
      type: "integer",
      label: "Scout Run Interval (seconds)",
      description: "How often the scout checks the web, in seconds. Minimum 1800 (30 minutes). Default 86400 (daily).",
      optional: true,
      default: 86400,
      min: 1800,
    },
    userTimezone: {
      propDefinition: [
        yutori,
        "userTimezone",
      ],
    },
    userLocation: {
      propDefinition: [
        yutori,
        "userLocation",
      ],
    },
    skipEmail: {
      type: "boolean",
      label: "Skip Email Notifications",
      description: "Disable Yutori email notifications for this scout's findings. Defaults to true since Pipedream steps handle the notifications instead.",
      optional: true,
      default: true,
    },
    hoursBack: {
      type: "integer",
      label: "Initial Lookback (hours)",
      description: "On first run, how many hours back to check for existing findings. Set to 0 to only emit new findings going forward.",
      optional: true,
      default: 24,
    },
  },
  hooks: {
    async activate() {
      const payload = {
        query: this.query,
        output_interval: this.outputInterval ?? 86400,
        skip_email: this.skipEmail ?? true,
      };
      if (this.userTimezone) payload.user_timezone = this.userTimezone;
      if (this.userLocation) payload.user_location = this.userLocation;

      const scout = await this.yutori.createScout(this, payload);
      this.db.set("scoutId", scout.id);
      this.db.set("scoutDisplayName", scout.display_name);
    },
    async deactivate() {
      const scoutId = this.db.get("scoutId");
      if (scoutId) {
        try {
          await this.yutori.deleteScout(this, scoutId);
        } catch (error) {
          if (error?.response?.status !== 404) {
            throw error;
          }
        }
      }
      this.db.set("scoutId", null);
      this.db.set("scoutDisplayName", null);
      this.db.set("lastTimestamp", null);
    },
  },
  methods: {
    _getScoutId() {
      return this.db.get("scoutId");
    },
    _getScoutDisplayName() {
      return this.db.get("scoutDisplayName") ?? "Yutori Scout";
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") ?? null;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
  },
  async run() {
    const scoutId = this._getScoutId();
    if (!scoutId) return;
    const scoutDisplayName = this._getScoutDisplayName();

    let sinceTimestamp = this._getLastTimestamp();

    // On first run, look back by hoursBack
    if (sinceTimestamp == null) {
      const hoursBack = this.hoursBack ?? 24;
      sinceTimestamp = hoursBack > 0
        ? Date.now() - hoursBack * 60 * 60 * 1000
        : Date.now();
    }

    const toEpochMs = (value) => {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (typeof value === "string") {
        const numeric = Number(value);
        if (value.trim() !== "" && Number.isFinite(numeric)) return numeric;
        const parsed = Date.parse(value);
        if (!Number.isNaN(parsed)) return parsed;
      }
      throw new Error(`Unexpected timestamp format: ${value}`);
    };

    const now = Date.now();
    // Collect pages until we cross the last emitted timestamp.
    const updates = [];
    let cursor = undefined;
    const seenCursors = new Set();
    const MAX_PAGES = 100;
    const PAGE_SIZE = 100;
    let pages = 0;
    let paginationTruncated = false;
    let reachedKnownHistory = false;
    do {
      if (pages++ >= MAX_PAGES) {
        paginationTruncated = true;
        break;
      }
      if (cursor && seenCursors.has(cursor)) break;
      if (cursor) seenCursors.add(cursor);

      const response = await this.yutori.getScoutUpdates(this, scoutId, {
        page_size: PAGE_SIZE,
        ...(cursor
          ? {
            cursor,
          }
          : {}),
      });
      const page = response?.updates ?? [];
      for (const update of page) {
        const timestamp = toEpochMs(update.timestamp);
        if (timestamp < sinceTimestamp) {
          reachedKnownHistory = true;
          continue;
        }
        updates.push(update);
      }
      cursor = response?.next_cursor ?? null;
    } while (cursor && !reachedKnownHistory);

    // Sort oldest-first for chronological emission, regardless of API ordering.
    const orderedUpdates = [
      ...updates,
    ].sort(
      (a, b) => toEpochMs(a.timestamp) - toEpochMs(b.timestamp),
    );

    for (const update of orderedUpdates) {
      this.$emit(update, {
        id: update.id,
        summary: `[${scoutDisplayName}] ${String(update.content || "").slice(0, 80)}`,
        ts: toEpochMs(update.timestamp),
      });
    }

    // Only advance lastTimestamp when pagination completed fully.
    // If truncated, leave it unchanged so the next run retries from the same window.
    if (!paginationTruncated) {
      if (orderedUpdates.length > 0) {
        const newestTimestamp = toEpochMs(orderedUpdates[orderedUpdates.length - 1].timestamp);
        this._setLastTimestamp(newestTimestamp + 1);
      } else {
        this._setLastTimestamp(now);
      }
    }
  },
  sampleEmit,
};
