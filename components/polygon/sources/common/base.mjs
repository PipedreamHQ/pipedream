import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import app from "../../polygon.app.mjs";

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
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      try {
        const lastDate = this._getLastDate();

        const response = this.app.paginate({
          fn: this.getFunction(),
          parseDataFn: this.parseData,
          ...this.getData(lastDate),
          maxResults,
        });

        let responseArray = [];
        for await (const item of response) {
          if (Date.parse(item.date) <= Date.parse(lastDate)) break;
          responseArray.push(item);
        }

        if (responseArray.length) {
          this._setLastDate(responseArray[0].published_utc);
        }

        for (const item of responseArray.reverse()) {
          const ts = Date.parse(item.published_utc || item.sip_timestamp || new Date());
          this.$emit(item, {
            id: item.id || ts,
            summary: this.getSummary(item),
            ts,
          });
        }
      } catch ({ response }) {
        throw new ConfigurationError(response.data.message);
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
