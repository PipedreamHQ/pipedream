import flowla from "../../flowla.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    flowla,
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
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const results = await this.flowla.getPaginatedResources({
        fn: this.getResourceFn(),
        params: this.getParams(),
      });
      let items = [];
      for await (const result of results) {
        const ts = Date.parse(result[this.getTsField()]);
        if (ts > lastTs) {
          items.push(result);
          if (ts > maxTs) {
            maxTs = ts;
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
    getParams() {
      return {};
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
