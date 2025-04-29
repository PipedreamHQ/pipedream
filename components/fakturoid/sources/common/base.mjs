import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import fakturoid from "../../fakturoid.app.mjs";

export default {
  props: {
    fakturoid,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountSlug: {
      propDefinition: [
        fakturoid,
        "accountSlug",
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
    getParams(lastDate) {
      return {
        since: lastDate,
      };
    },
    getDateField() {
      return "created_at";
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const dateField = this.getDateField();
      const response = this.fakturoid.paginate({
        fn: this.getFunction(),
        accountSlug: this.accountSlug,
        params: this.getParams(lastDate),
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        responseArray = responseArray
          .sort((a, b) => Date.parse(b[dateField]) - Date.parse(a[dateField]));

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
