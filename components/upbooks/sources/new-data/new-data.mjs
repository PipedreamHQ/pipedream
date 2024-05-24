import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import upbooks from "../../upbooks.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "upbooks-new-data",
  name: "New Data Available",
  description: "Emit new event when fresh data is available for a specific collection.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    upbooks,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00Z";
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item._id,
        summary: `New ${item.title}`,
        ts: item.occurredAt,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const { data } = await this.upbooks.listActivities({
        params: {
          fromDate: lastDate,
        },
      });

      if (maxResults && maxResults.length > maxResults) maxResults.length = maxResults;
      if (data.length) this._setLastDate(data[0].occurredAt);

      for (const item of data.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
