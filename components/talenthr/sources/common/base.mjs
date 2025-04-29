import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import talenthr from "../../talenthr.app.mjs";

export default {
  props: {
    talenthr,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getConfig() {
      return {};
    },
    sortData(data) {
      return data;
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.talenthr.paginate({
        fn: this.getFunction(),
        maxResults,
        ...this.getConfig(),
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = this.sortData(responseArray);
      responseArray = responseArray.filter((item) => item.id > lastId);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
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
