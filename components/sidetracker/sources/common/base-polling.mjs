import sidetracker from "../../sidetracker.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    sidetracker,
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
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    getParams() {
      return {};
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const results = this.sidetracker.paginate({
        fn: this.getResourceFn(),
        params: this.getParams(),
      });

      let items = [];
      for await (const item of results) {
        const ts = Date.parse(item.created_at);
        if (ts > lastTs) {
          items.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }

      if (!items.length) {
        return;
      }

      this._setLastTs(maxTs);

      if (max && items.length > max) {
        items = items.slice(-1 * max);
      }

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
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
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
