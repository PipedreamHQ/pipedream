import corporateMerch from "../../corporate_merch.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    corporateMerch,
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
      await this.processEvents(10);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item.created_at),
      };
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let resourceFn = this.getResourceFn();

      const { data } = await resourceFn({
        params: {
          page: 1,
          limit: 100,
        },
      });

      const results = [];
      for (const item of data) {
        const ts = Date.parse(item.created_at);
        if (ts > lastTs) {
          results.push(item);
          if (max && results.length >= max) {
            break;
          }
        } else {
          break;
        }
      }

      if (!results.length) {
        return;
      }

      this._setLastTs(Date.parse(results[0].created_at));

      for (const item of results.reverse()) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn must be implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary must be implemented");
    },
  },
  async run() {
    await this.processEvents();
  },
};
