import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import richpanel from "../../richpanel.app.mjs";

export default {
  props: {
    richpanel,
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
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const dateField = this.getDateField();

      const response = this.richpanel.paginate({
        fn: this.richpanel.listTickets,
        params: {
          ...this.getParams(),
          sortKey: dateField,
          order: "DESC",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item[dateField]) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0][dateField]);
      }

      for (const item of responseArray.reverse()) {
        const dateField = item[dateField];
        this.$emit(item, {
          id: `${item.id}-${dateField}`,
          summary: this.getSummary(item),
          ts: Date.parse(dateField),
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
