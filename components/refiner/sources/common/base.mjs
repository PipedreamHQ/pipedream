import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import refiner from "../../refiner.app.mjs";

export default {
  props: {
    refiner,
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

      const response = this.refiner.paginate({
        fn: this.getFunction(),
        params: this.getParams(),
      });

      let responseArray = [];
      for await (const item of response) {
        const itemDate = this.getItemDate(item);
        if (Date.parse(itemDate) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        const itemDate = this.getItemDate(responseArray[0]);
        this._setLastDate(itemDate);
      }

      for (const item of responseArray.reverse()) {
        const itemDate = this.getItemDate(item);

        this.$emit(item, {
          id: item.uuid,
          summary: this.getSummary(item),
          ts: Date.parse(itemDate),
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
