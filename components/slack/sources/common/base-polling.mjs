import slack from "../../slack.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    slack,
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
    getResources() {
      throw new ConfigurationError("getResources is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    async processEvents(max) {
      const results = await this.getResources(max);
      if (!results.length) {
        return;
      }

      results.forEach((result) => {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
