import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import refiner from "../../refiner.app.mjs";

export default {
  key: "refiner-new-segment-entry",
  name: "New Segment Entry",
  description: "Emits a new event whenever a user enters a segment in Refiner. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    refiner: {
      type: "app",
      app: "refiner",
    },
    db: {
      type: "$.service.db",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const MAX_EVENTS = 50;
      const lastTs = await this.db.get("lastTs") || 0;

      const entries = await this.refiner._makeRequest({
        method: "GET",
        path: "/segment-entries",
        params: {
          since: lastTs,
          limit: MAX_EVENTS,
          sort: "desc",
        },
      });

      let newLastTs = lastTs;

      for (const entry of entries) {
        const ts = entry.timestamp
          ? Date.parse(entry.timestamp)
          : Date.now();
        this.$emit(entry, {
          id: entry.id ?? ts,
          summary: `User ${entry.userId} entered segment ${entry.segmentId}`,
          ts,
        });

        if (ts > newLastTs) {
          newLastTs = ts;
        }

        if (--MAX_EVENTS <= 0) break;
      }

      await this.db.set("lastTs", newLastTs);
    },
    async activate() {
      // Activation logic if any
    },
    async deactivate() {
      // Deactivation logic if any
    },
  },
  async run() {
    const lastTs = await this.db.get("lastTs") || 0;

    const entries = await this.refiner._makeRequest({
      method: "GET",
      path: "/segment-entries",
      params: {
        since: lastTs,
        sort: "asc",
      },
    });

    let newLastTs = lastTs;

    for (const entry of entries) {
      const ts = entry.timestamp
        ? Date.parse(entry.timestamp)
        : Date.now();
      this.$emit(entry, {
        id: entry.id ?? ts,
        summary: `User ${entry.userId} entered segment ${entry.segmentId}`,
        ts,
      });

      if (ts > newLastTs) {
        newLastTs = ts;
      }
    }

    await this.db.set("lastTs", newLastTs);
  },
};
