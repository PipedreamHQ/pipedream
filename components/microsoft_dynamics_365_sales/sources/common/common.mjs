import microsoftDynamics365Sales from "../../microsoft_dynamics_365_sales.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    microsoftDynamics365Sales,
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
    getArgs() {
      return {};
    },
    getRelevantResults(results) {
      return results;
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
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const items = this.microsoftDynamics365Sales.paginate({
        fn: resourceFn,
        args,
        max,
      });

      const results = [];
      for await (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts >= lastTs) {
          results.push(item);
          maxTs = Math.max(ts, maxTs);
        } else {
          break;
        }
      }
      this._setLastTs(maxTs);

      const relevantResults = this.getRelevantResults(results);
      if (!relevantResults.length) {
        return;
      }

      relevantResults.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  async run() {
    await this.processEvent();
  },
};
