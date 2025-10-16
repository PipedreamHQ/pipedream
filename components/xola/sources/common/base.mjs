import app from "../../xola.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

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
    _getLastCreatedAt() {
      return this.db.get("lastCreatedAt");
    },
    _setLastCreatedAt(lastCreatedAt) {
      this.db.set("lastCreatedAt", lastCreatedAt);
    },
    _getLastUpdatedAt() {
      return this.db.get("lastUpdatedAt");
    },
    _setLastUpdatedAt(lastUpdatedAt) {
      this.db.set("lastUpdatedAt", lastUpdatedAt);
    },
    _getProcessedIds() {
      return this.db.get("processedIds") || [];
    },
    _setProcessedIds(ids) {
      this.db.set("processedIds", ids);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getParams() {
      return {};
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
