import suitedash from "../../suitedash.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    suitedash,
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
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getParams() {
      return {};
    },
    getTsField() {
      return "created";
    },
    generateMeta(item) {
      return {
        id: item.uid,
        summary: this.getSummary(item),
        ts: Date.parse(item[this.getTsField()]),
      };
    },
    getFn() {
      throw new Error("getFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      let results = [];

      const items = this.suitedash.paginate({
        fn: this.getFn(),
        params: this.getParams(),
      });

      for await (const item of items) {
        const ts = Date.parse(item[this.getTsField()]);
        if (ts >= lastTs) {
          results.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }

      this._setLastTs(maxTs);

      if (max) {
        results = results.slice(-1 * max);
      }

      results.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
  },
  async run() {
    await this.processEvent();
  },
};
