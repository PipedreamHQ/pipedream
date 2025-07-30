import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import letzai from "../../letzai.app.mjs";

export default {
  props: {
    letzai,
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

      const response = this.letzai.paginate({
        fn: this.getFunction(),
        params: {
          sortBy: "createdAt",
          sortOrder: "DESC",
        },
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        const createdAt = item.createdAt || item.imageCompletionChoices[0].createdAt;
        if (Date.parse(createdAt) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        const createdAt = responseArray[0].createdAt
        || responseArray[0].imageCompletionChoices[0].createdAt;
        this._setLastDate(Date.parse(createdAt));
      }

      for (const item of responseArray.reverse()) {
        const ts = item.createdAt || item.imageCompletionChoices[0].createdAt;
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(ts),
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
