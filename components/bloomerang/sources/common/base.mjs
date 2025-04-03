import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../bloomerang.app.mjs";

export default {
  props: {
    app,
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
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.app.paginate({
        fn: this.getFunction(),
        params: {
          orderBy: "CreatedDate",
          orderDirection: "Desc",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.Id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].Id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.Id,
          summary: this.getSummary(item),
          ts: Date.parse(item.AuditTrail.CreatedDate || new Date()),
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
