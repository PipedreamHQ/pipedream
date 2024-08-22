import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  props: {
    quickbooks,
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
      return this.db.get("lastDate") || "1970-01-01";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const fieldDate = this.getFieldDate();

      const response = await this.quickbooks.paginate({
        fn: this.quickbooks.query,
        maxResults,
        query: this.getQuery(this._getLastDate()),
        fieldList: this.getFieldList(),
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        this._setLastDate(responseArray[0].MetaData[fieldDate]);
      }

      for (const item of responseArray.reverse()) {
        const ts = Date.parse(item.MetaData[fieldDate]);
        this.$emit(item, {
          id: `${item.Id}-${ts}`,
          summary: this.getSummary(item),
          ts,
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
