import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pexels from "../../pexels.app.mjs";

export default {
  props: {
    pexels,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getParams() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.pexels.paginate({
        fn: this.getFunction(),
        params: this.getParams(),
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.id === lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.now(),
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
