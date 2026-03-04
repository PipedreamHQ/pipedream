import crisp from "../../crisp.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    crisp,
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
    filterByTimestamp() {
      return true;
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const args = this.getArgs(lastTs);
      const tsField = this.getTsField();

      const { data } = await resourceFn(args);
      if (!data?.length) {
        return;
      }
      const items = [];
      for (const item of data) {
        const ts = item[tsField];
        if (!this.filterByTimestamp() || !lastTs || ts > Date.parse(lastTs)) {
          items.push(item);
          if (!maxTs || ts > Date.parse(maxTs)) {
            maxTs = new Date(ts).toISOString();
          }
        }
      }

      if (!items.length) {
        return;
      }

      if (max && items.length > max) {
        items.length = max;
      }

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });

      this._setLastTs(maxTs);
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
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
