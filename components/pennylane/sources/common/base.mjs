import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pennylane from "../../pennylane.app.mjs";

export default {
  props: {
    pennylane,
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

      const response = this.pennylane.paginate({
        fn: this.getFunction(),
        fieldName: this.getFieldName(),
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.source_id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].source_id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.source_id,
          summary: this.getSummary(item),
          ts: Date.parse(item.updated_at || item.activated_at || new Date()),
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
