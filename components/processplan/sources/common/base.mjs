import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../processplan.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getSeenIds() {
      return new Set(this.db.get("seenIds") || []);
    },
    _saveSeenIds(ids) {
      // Keep last 1000 to avoid unbounded growth
      this.db.set("seenIds", Array.from(ids).slice(-1000));
    },
    generateMeta(item) {
      const ts = Date.parse(
        item.started_at
          || item.assigned_at
          || item.completed_at
          || item.created_at
          || new Date(),
      );
      return {
        id: String(item.id),
        summary: item.name || `Event ${item.id}`,
        ts,
      };
    },
  },
};
