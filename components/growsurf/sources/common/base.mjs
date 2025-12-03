import growsurf from "../../growsurf.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    growsurf,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    async processEvent(max) {
      const results = await this.getResources(max);
      if (!results.length) {
        return;
      }
      for (const result of results) {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
