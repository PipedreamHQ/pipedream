import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import acymailing from "../../acymailing.app.mjs";

export default {
  props: {
    acymailing,
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
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: item.createdAt,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      const response = this.acymailing.paginate({
        fn: this.getFn(),
        params: this.getParams(),
      });

      const responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      const dateField = this.getDateField();

      let filteredArray = responseArray
        .sort((a, b) => Date.parse(b[dateField]) - Date.parse(a[dateField]));

      filteredArray = filteredArray.filter((item) => Date.parse(item[dateField]) > lastDate);

      if (maxResults && filteredArray.length > maxResults) {
        filteredArray.length = maxResults;
      }

      if (filteredArray.length) this._setLastDate(Date.parse(filteredArray[0][dateField]));

      for (const item of filteredArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
