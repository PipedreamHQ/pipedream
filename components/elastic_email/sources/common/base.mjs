import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../elastic_email.app.mjs";

export default {
  props: {
    app,
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
      return this.db.get("lastDate") || "1970-01-01T01:01:01";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getFunction() {
      return this.app.loadEvents;
    },
    getEventType() {
      return "";
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const dateField = this.getDateField();
      const idField = this.getIdField();

      const response = this.app.paginate({
        fn: this.getFunction(),
        maxResults,
        params: {
          from: lastDate,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        const eventType = this.getEventType();
        if (eventType && !eventType.includes(item.EventType)) continue;
        if (Date.parse(item[dateField]) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0][dateField]);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item[idField],
          summary: this.getSummary(item),
          ts: Date.parse(item[dateField] || new Date()),
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
