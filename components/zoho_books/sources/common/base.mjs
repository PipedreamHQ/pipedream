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
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.zohoBooks.paginate({
        fn: this.getFunction(),
        fieldName: this.getFieldName(),
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.created_time <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].created_time));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item[this.getFieldId()],
          summary: this.getSummary(item),
          ts: Date.parse(item.created_time),
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
