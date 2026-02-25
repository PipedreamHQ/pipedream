import rewardSciences from "../../reward_sciences.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    rewardSciences,
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
    async processEvents(max) {
      const lastId = this._getLastId();
      const {
        results, newLastId,
      } = await this.getResults(lastId, max);
      if (!results?.length) {
        return;
      }
      this._setLastId(newLastId);
      results.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResults() {
      throw new ConfigurationError("getResults must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
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
