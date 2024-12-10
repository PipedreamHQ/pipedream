import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import agiliron from "../../agiliron.app.mjs";

export default {
  props: {
    agiliron,
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
      return this.db.get("lastDate") || "01-01-1970";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fields = this.getFields();

      const response = this.agiliron.paginate({
        fn: this.getFunction(),
        params: {
          filter: `CreatedTime,gt,${lastDate}`,
        },
        fields,
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray.sort(
        (a, b) => (Date.parse(b[fields.date]) - Date.parse(a[fields.date])),
      );

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0][fields.date]);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item[fields.id],
          summary: this.getSummary(item),
          ts: Date.parse(item[fields.date]),
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
