import domainGroup from "../../domain_group.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    domainGroup,
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
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getArgs() {
      return {};
    },
    async getResults() {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const items = this.domainGroup.paginate({
        resourceFn,
        args,
      });

      const results = [];
      for await (const item of items) {
        const ts = item[tsField];
        if (!lastTs || (Date.parse(ts) > Date.parse(lastTs))) {
          results.push(item);
          if (!maxTs || (Date.parse(ts) > Date.parse(maxTs))) {
            maxTs = ts;
          }
        }
      }

      if (maxTs) {
        this._setLastTs(maxTs);
      }

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
  },
  async run() {
    const results = await this.getResults();

    if (!results.length) {
      return;
    }

    results.forEach((item) => {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
};
