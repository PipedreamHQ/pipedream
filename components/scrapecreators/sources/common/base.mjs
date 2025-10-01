import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import scrapecreators from "../../scrapecreators.app.mjs";

export default {
  props: {
    scrapecreators,
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
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const fieldId = this.getFieldId();
      const fn = this.getFunction();
      const { value: response } = await fn();

      let responseArray = [];
      for (const item of response) {
        if (item[fieldId] === lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0][fieldId]);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item[fieldId],
          summary: this.getSummary(item),
          ts: Date.parse(new Date()),
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
