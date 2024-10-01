import helpspot from "../../helpspot.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "helpspot-request-update",
  name: "Request Update",
  description: "Emit new event when a request is updated. [See the documentation](https://support.helpspot.com/index.php?pg=kb.page&id=163)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    helpspot,
    db: "$.service.db",
    requestId: {
      propDefinition: [
        helpspot,
        "requestId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  methods: {
    _getLastUpdated() {
      return this.db.get("lastUpdated") ?? null;
    },
    _setLastUpdated(ts) {
      this.db.set("lastUpdated", ts);
    },
  },
  hooks: {
    async deploy() {
      // Fetch initial data
      const request = await this.helpspot.getRequest({
        requestId: this.requestId,
      });
      if (request.request_history && request.request_history.length > 0) {
        // Emit the most recent history record, if available
        const latestHistory = request.request_history[0];
        this.$emit(latestHistory, {
          id: latestHistory.xRequestHistory,
          summary: `New update for request: ${latestHistory.xRequest}`,
          ts: Date.parse(latestHistory.dtGMTChange),
        });
        this._setLastUpdated(latestHistory.dtGMTChange);
      }
    },
  },
  async run() {
    const lastUpdated = this._getLastUpdated();
    const request = await this.helpspot.getRequest({
      requestId: this.requestId,
    });
    if (request.request_history && request.request_history.length > 0) {
      for (const historyItem of request.request_history) {
        const historyTimestamp = Date.parse(historyItem.dtGMTChange);
        if (!lastUpdated || historyTimestamp > Date.parse(lastUpdated)) {
          this.$emit(historyItem, {
            id: historyItem.xRequestHistory,
            summary: `Update for request: ${historyItem.xRequest}`,
            ts: historyTimestamp,
          });
          this._setLastUpdated(historyItem.dtGMTChange);
        }
      }
    }
  },
};
