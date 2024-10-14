import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import adhook from "../../adhook.app.mjs";

export default {
  props: {
    adhook,
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
      const fieldDate = this.getFieldDate();
      const fn =  this.getFunction();
      let response = await fn();

      response = response.filter((item) => Date.parse(item[fieldDate]) > lastDate);

      if (response.length) {
        if (maxResults && (response.length > maxResults)) {
          response.length = maxResults;
        }
        this._setLastDate(Date.parse(response[0][fieldDate]));
      }

      for (const item of response.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item[fieldDate]),
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
