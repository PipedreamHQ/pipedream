import hrCloud from "../../hr_cloud.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    hrCloud,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      let results = await this.getResults();
      results = results.slice(-1 * 25);
      results.forEach((item) => this.emitEvent(item));
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    async getResults() {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const params = this.getParams();
      const tsField = this.getTsField();

      const items = this.hrCloud.paginate({
        resourceFn,
        params,
      });

      const results = [];
      for await (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts >= lastTs) {
          results.push(item);
          maxTs = Math.max(maxTs, ts);
        }
      }

      this._setLastTs(maxTs);
      return results;
    },
    getParams() {
      return {};
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getTsField() {
      throw new ConfigurationError("getTsField is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  async run() {
    const results = await this.getResults();
    results.forEach((item) => this.emitEvent(item));
  },
};
