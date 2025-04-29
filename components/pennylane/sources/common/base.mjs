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
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.pennylane.paginate({
        fn: this.getFunction(),
        fieldName: this.getFieldName(),
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.updated_at) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].updated_at);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.source_id || item.id,
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
