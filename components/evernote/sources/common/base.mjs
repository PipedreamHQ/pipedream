import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import evernote from "../../evernote.app.mjs";

export default {
  props: {
    evernote,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastData() {
      return this.db.get("lastData") || this.getDefaultData();
    },
    _setLastData(lastData) {
      this.db.set("lastData", lastData);
    },
    getDefaultData() {
      return 0;
    },
    checkBreak() {
      return false;
    },
    prepareResults(responseArray) {
      return responseArray;
    },
    async emitEvent(maxResults = false) {
      const lastData = this._getLastData();
      let responseArray = await this.getData(lastData);

      responseArray = this.prepareResults(responseArray, lastData, maxResults);

      if (responseArray.length) {
        this._setLastData(this.lastData(responseArray));
      }

      for (const item of responseArray) {
        this.$emit(item, {
          id: item.guid,
          summary: this.getSummary(item),
          ts: Date.parse(item.created || item.serviceCreated || new Date()),
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
