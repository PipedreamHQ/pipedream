import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import wati from "../../wati.app.mjs";

export default {
  props: {
    wati,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getOpts() {
      return {};
    },
    filterItems() {
      () => true;
    },
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const dateField = this.getDateField();

      const response = this.wati.paginate({
        fn: this.getFunction(),
        ...this.getOpts(),
        itemsField: this.getItemsField(),
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (this.checkBreak(item, lastDate)) break;
        responseArray.push(item);
      }

      responseArray = responseArray.filter(this.filterItems);

      if (responseArray.length) {
        this._setLastDate(responseArray[0][dateField]);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
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
