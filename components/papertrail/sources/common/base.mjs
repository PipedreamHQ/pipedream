import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import papertrail from "../../papertrail.app.mjs";

export default {
  props: {
    papertrail,
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
    lastId(results) {
      return results[results.length - 1].id;
    },
    prepareResults(responseArray) {
      return responseArray;
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      let responseArray = await this.prepareResults(lastId, maxResults);

      if (responseArray.length) {
        this._setLastId(this.lastId(responseArray));
      }

      for (const item of responseArray) {
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
