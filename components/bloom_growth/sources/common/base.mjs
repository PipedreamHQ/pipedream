import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import bloomGrowth from "../../bloom_growth.app.mjs";

export default {
  type: "source",
  dedupe: "unique",
  props: {
    bloomGrowth,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Bloom Growth on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    meetingId: {
      propDefinition: [
        bloomGrowth,
        "meetingId",
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    filterRelevantItems(items, lastId) {
      return items.filter((item) => item.Id > lastId);
    },
    async startEvent(maxResults) {
      const {
        bloomGrowth,
        meetingId,
      } = this;

      const lastId = this._getLastId();
      const func = this.getFunction(bloomGrowth);
      let items = await func({
        meetingId,
      });

      items = (this.filterRelevantItems(items, lastId)).slice(-maxResults);
      if (items.length) this._setLastId(items[items.length - 1].Id);

      for (const item of items.reverse()) {
        this.$emit(
          item,
          {
            id: item.Id,
            summary: this.getSummary(item.Id),
            ts: item.CreateTime,
          },
        );
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
};
