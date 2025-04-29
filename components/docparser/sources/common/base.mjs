import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../docparser.app.mjs";

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
    parserId: {
      propDefinition: [
        app,
        "parserId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fn = this.getFunction();
      const params = {
        sort_by: "parsed_at",
        sort_order: "DESC",
        list: "processed_after",
        date: lastDate,
      };

      if (maxResults) {
        params.limit = maxResults;
      }

      const response = await fn({
        parserId: this.parserId,
        params,
      });

      if (response.length) {
        const dateTime = response[0].processed_at_utc;
        this._setLastDate(dateTime.substring(0, dateTime.length - 6));
      }

      for (const item of response.reverse()) {
        this.$emit(item, {
          id: item.id,
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
