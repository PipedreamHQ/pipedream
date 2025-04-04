import mistralAI from "../../mistral_ai.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    mistralAI,
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
    async getPaginatedResults(fn, params, max) {
      const items = this.mistralAI.paginate({
        fn,
        params,
        max,
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
      }

      return results;
    },
    async processEvent(max) {
      const fn = this.getResourceFn();
      const params = this.getParams();
      const paginated = this.isPaginated();

      let results;
      if (paginated) {
        results = await this.getPaginatedResults(fn, params, max);
        this.findAndSetLastTs(results);
      } else {
        results = (await fn({
          params,
        })).data;
      }

      results.forEach((result) => {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      });
    },
    findAndSetLastTs(results) {
      let maxTs = this._getLastTs();
      for (const result of results) {
        maxTs = Math.max(result.created_at, maxTs);
      }
      this._setLastTs(maxTs);
    },
    getParams() {
      return {};
    },
    isPaginated() {
      return true;
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
