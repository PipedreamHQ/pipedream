import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  props: {
    zohoBooks,
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
    getTsField() {
      return "created_time";
    },
    getParams() {
      return {};
    },
    isSorted() {
      return true;
    },
    getItemId(item) {
      return item[this.getFieldId()];
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      let maxDate = lastDate;

      const response = this.zohoBooks.paginate({
        fn: this.getFunction(),
        fieldName: this.getFieldName(),
        params: this.getParams(lastDate),
      });

      let responseArray = [];
      const tsField = this.getTsField();
      const isSorted = this.isSorted();

      for await (const item of response) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastDate) {
          responseArray.push(item);
          if (!isSorted) {
            maxDate = Math.max(maxDate, ts);
          }
        } else {
          if (isSorted) {
            break;
          }
        }
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(isSorted
          ? Date.parse(responseArray[0][tsField])
          : maxDate);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: this.getItemId(item),
          summary: this.getSummary(item),
          ts: Date.parse(item[tsField]),
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
