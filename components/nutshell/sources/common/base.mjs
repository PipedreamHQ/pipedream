import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import nutshell from "../../nutshell.app.mjs";

export default {
  props: {
    nutshell,
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
      return this.db.get("lastData") || 0;
    },
    _setLastData(lastData) {
      this.db.set("lastData", lastData);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item.createdTime || Date.now()),
      };
    },
    async prepareData({
      data, lastData, maxResults,
    }) {
      let responseArray = [];
      for await (const item of data) {
        if (item.id === lastData) break;
        responseArray.push(item);
      }
      if (responseArray.length) this._setLastData(responseArray[0].id);
      if (maxResults && (responseArray.length > maxResults)) responseArray.length = maxResults;
      return responseArray;
    },
    getQuery() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastData = this._getLastData();

      let data = this.nutshell.paginate({
        method: this.getMethod(),
        query: this.getQuery(),
      });

      let responseArray = await this.prepareData({
        data,
        lastData,
        maxResults,
      });

      for (const item of responseArray.reverse()) {
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
