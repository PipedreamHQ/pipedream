import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import simplero from "../../simplero.app.mjs";

export default {
  props: {
    simplero,
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
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getFunction() {
      throw new Error("getFunction is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    getParams() {
      return {};
    },
    async processEvents(maxResults = false) {
      const lastId = this._getLastId();
      const idField = this.getIdField();

      const response = this.simplero.paginate({
        fn: this.getFunction(),
        maxResults,
        params: {
          ...this.getParams(lastId),
          dir: "desc",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0][idField]);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item[idField],
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  async run() {
    await this.processEvents();
  },
};

