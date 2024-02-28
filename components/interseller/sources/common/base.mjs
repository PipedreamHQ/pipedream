import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import interseller from "../../interseller.app.mjs";

export default {
  props: {
    interseller,
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
    _setLastDate(createdAt) {
      this.db.set("lastDate", createdAt);
    },
    generateMeta(event, dateField) {
      return {
        id: event.id,
        summary: this.getSummary(event),
        ts: Date.parse(event[dateField]),
      };
    },
    getParams() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      let data = this.interseller.paginate({
        fn: this.interseller.listContacts,
        params: this.getParams(),
        maxResults,
      });

      const dateField = this.getDateField();

      const responseArray = [];
      for await (const item of data) {
        if (Date.parse(item[dateField]) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0][dateField]);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item, dateField));
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
