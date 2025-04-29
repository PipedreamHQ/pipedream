import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import motive from "../../motive.app.mjs";

export default {
  props: {
    motive,
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
      const fieldName = this.getFieldName();

      const response = this.motive.paginate({
        fn: this.getFunction(),
        fieldName: `${fieldName}s`,
      });

      let responseArray = [];
      for await (const item of response) {
        const data = item[fieldName];
        if (data.id <= lastId) break;
        responseArray.push(data);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        const data = item[fieldName];
        this.$emit(data, {
          id: data.id,
          summary: this.getSummary(data),
          ts: Date.parse(data.start_time || new Date()),
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
