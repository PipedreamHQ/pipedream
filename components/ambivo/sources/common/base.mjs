import ambivo from "../../ambivo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    ambivo,
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
    async processEvent(limit) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const tsField = this.getTsField();
      const results = [];
      let count = 0;

      const items = await resourceFn(); console.log(items);
      for (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts >= lastTs && this.isRelevant(item)) {
          maxTs = Math.max(ts, maxTs);
          results.push(item);
          count++;
          if (limit && count >= limit) {
            break;
          }
        }
      }

      results.reverse().forEach((item) => this.emitEvent(item));
      this._setLastTs(maxTs);
    },
    isRelevant() {
      return true;
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
