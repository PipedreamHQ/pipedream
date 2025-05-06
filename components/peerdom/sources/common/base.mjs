import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import peerdom from "../../peerdom.app.mjs";

export default {
  props: {
    peerdom,
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
      return this.db.get("lastId") || "";
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    sortItems(items) {
      return items;
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const fn = this.getFunction();

      const response = this.sortItems(await fn());

      let responseArray = [];
      for (const item of response.reverse()) {
        if (item.id == lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
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
