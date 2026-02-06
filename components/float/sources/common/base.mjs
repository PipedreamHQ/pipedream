import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import float from "../../float.app.mjs";

export default {
  props: {
    float,
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
      const response = this.float.paginate({
        fn,
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item[fieldId] <= lastId) break;
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
