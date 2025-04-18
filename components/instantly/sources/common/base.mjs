import instantly from "../../instantly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    instantly,
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
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item[this.getTsField()]),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();
      const isSortedDesc = args?.sort_order === "desc";

      const items = this.instantly.paginate({
        fn: resourceFn,
        args,
        max: isSortedDesc && max,
      });

      let results = [];
      for await (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts >= lastTs) {
          results.push(item);
          maxTs = Math.max(ts, maxTs);
        } else if (isSortedDesc) {
          break;
        }
      }

      if (!results.length) {
        return;
      }

      if (max && !isSortedDesc) {
        results = results.slice(-1 * max).reverse();
      }

      results.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });

      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
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
