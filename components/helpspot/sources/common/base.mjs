import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import helpspot from "../../helpspot.app.mjs";

export default {
  props: {
    helpspot,
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
      return this.db.get("lastDate") || 1;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    _getMaxDate({ request_history: { item } }) {
      const history = Object.entries(item).map(([
        , item,
      ]) => item.dtGMTChange);
      return Date.parse(history[history.length - 1]) / 1000;
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      let responseArray = await this.getItems(maxResults, lastDate);

      if (responseArray.length) {
        this._setLastDate(responseArray[0].lastDate);
      }

      for (const item of responseArray.reverse()) {
        const ts = item.lastDate;

        this.$emit(item, {
          id: `${item.xRequest}-${ts}`,
          summary: this.getSummary(item),
          ts: ts,
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
