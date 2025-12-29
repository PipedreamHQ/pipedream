import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import invoiced from "../../invoiced.app.mjs";

export default {
  props: {
    invoiced,
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
    getParams() {
      return {};
    },
    getDateField() {
      return "created_at";
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fn = this.getFunction();
      const params = this.getParams();
      const dateField = this.getDateField();

      const response = this.invoiced.paginate({
        fn,
        params: {
          sort: `${dateField} desc`,
          ...params,
        },
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item[dateField] <= lastDate) break;
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
          id: `${item.id}-${item[dateField]}`,
          summary: this.getSummary(item),
          ts: Date.parse(item[dateField]),
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
