import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import xendit from "../../xendit.app.mjs";

export default {
  props: {
    xendit,
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
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const cursor = this.getCursor();

      const response = this.xendit.paginate({
        fn: this.getFunction(),
        cursor,
        maxResults,
      });

      const responseArray = [];

      for await (const item of response) {
        if (Date.parse(item.created) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(Date.parse(responseArray[0].created));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.created || new Date()),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
