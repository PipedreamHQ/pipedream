import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import allocadence from "../../allocadence.app.mjs";

export default {
  props: {
    allocadence,
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
      return this.db.get("lastDate") || "1970-01-01T00:00:01";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    prepareData({
      responseArray, fieldDate,
    }) {
      if (responseArray.length) {
        this._setLastDate(responseArray[0][fieldDate]);
      }
      return responseArray;
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fieldDate = this.getFieldDate();

      const response = this.allocadence.paginate({
        fn: this.getFunction(),
        params: this.getParams(lastDate),
        dataField: this.getDataField(),
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      const preparedData = this.prepareData({
        responseArray,
        fieldDate,
        maxResults,
      });

      for (const item of preparedData.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(new Date()),
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
