import contentRabbitApp from "../../contentrabbit.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "contentrabbit-new-activity-event",
  name: "New Activity Event",
  description: "Emit new event when team activity occurs. [See the documentation](https://contentrabbitai.com/api/public/v1/docs#/Activity/getActivity)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    contentRabbitApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25, true);
    },
  },
  methods: {
    _getSavedTs() {
      return this.db.get("savedTs") ?? 0;
    },
    _setSavedTs(ts) {
      this.db.set("savedTs", ts);
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `${event.eventType} - ${event.message || event.id}`,
        ts: Date.parse(event.occurredAt),
      };
    },
    async processEvent(max, isDeploy = false) {
      const limit = max ?? 100;
      const savedTs = this._getSavedTs();
      let maxTs = savedTs;

      if (isDeploy) {
        const response = await this.contentRabbitApp.listActivity({
          params: { limit },
        });
        const items = response.data?.items ?? [];
        for (const item of items) {
          const ts = Date.parse(item.occurredAt);
          this.$emit(item, this.generateMeta(item));
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
        // If deploy found no activity, bookmark "now" so the next poll doesn't
        // fall back to an unbounded, full-history fetch.
        if (items.length === 0) {
          maxTs = Date.now();
        }
        this._setSavedTs(maxTs);
        return;
      }

      // The API's `cursor` only pages backward through a fixed date window, so
      // it can't be reused across polls as a "what's new" marker. Instead, use
      // a saved high-water timestamp as `start`, and only page (via `cursor`)
      // within a single poll to cover more than `limit` new events at once.
      let cursor;
      for (;;) {
        const response = await this.contentRabbitApp.listActivity({
          params: {
            start: savedTs > 0 ? new Date(savedTs).toISOString() : undefined,
            limit,
            cursor,
          },
        });

        const items = response.data?.items ?? [];
        const pagination = response.data?.pagination;

        for (const item of items) {
          const ts = Date.parse(item.occurredAt);
          if (ts >= savedTs) {
            this.$emit(item, this.generateMeta(item));
          }
          if (ts > maxTs) {
            maxTs = ts;
          }
        }

        if (!pagination?.hasMore || !pagination?.cursor) {
          break;
        }
        cursor = pagination.cursor;
      }

      this._setSavedTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};