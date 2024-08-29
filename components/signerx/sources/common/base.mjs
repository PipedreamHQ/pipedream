import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import signerx from "../../signerx.app.mjs";

export default {
  props: {
    signerx,
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
      return this.db.get("lastDate") || "1970-01-01T00:00:00.000Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getParams() {
      return {};
    },
    getDateField() {
      return "created_at";
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const dateField = this.getDateField();
      const response = this.signerx.paginate({
        fn: this.signerx.listPackages,
        maxResults,
        params: this.getParams(),
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item[dateField]) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

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
