import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pdffiller from "../../pdffiller.app.mjs";

export default {
  props: {
    pdffiller,
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
      const response = this.pdffiller.paginate({
        fn: this.getFunction(),
        maxResults,
        params: {
          order: "desc",
          order_by: "id",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.created <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].created);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: item.created,
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
