import graceblocks from "../../graceblocks.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    graceblocks,
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
      const results = this.graceblocks.paginate({
        resourceFn: this.getResourceFn(),
        params: this.getParams(),
        max,
      });
      let items = [];
      for await (const result of results) {
        const ts = Date.parse(result[this.getTsField()]);
        if (ts >= lastTs) {
          items.push(result);
        } else {
          break;
        }
      }

      items = this.filterItems(items);

      if (!items.length) {
        return;
      }

      this._setLastTs(Date.parse(items[0][this.getTsField()]));

      items.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
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
    filterItems(items) {
      return items;
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
