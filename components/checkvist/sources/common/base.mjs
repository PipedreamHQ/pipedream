import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import checkvist from "../../checkvist.app.mjs";

export default {
  props: {
    checkvist,
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
    getArgs() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();
      const fn = this.getFunction();

      const response = await fn({
        ...this.getArgs(),
        params: {
          order: "id:desc",
        },
      });

      let responseArray = [];
      for (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        const summary = this.getSummary(item);
        this.$emit(item, {
          id: item.id,
          summary: summary.length > 40
            ? `${summary.slice(0, 39)}...`
            : summary,
          ts: Date.parse(item.created_at),
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
