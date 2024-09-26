import gtmetrix from "../../gtmetrix.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    gtmetrix,
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
      await this.processResult(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    async processResult(limit) {
      const lastTs = this._getLastTs();
      const tsField = this.getTsField();

      const items = this.gtmetrix.paginate({
        resourceFn: this.getResourceFn(),
        args: this.getArgs(lastTs),
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
        if (limit && results.length >= limit) {
          break;
        }
      }

      if (!results?.length) {
        return;
      }

      this._setLastTs(results[0].attributes[tsField]);

      for (const result of results.reverse()) {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      }
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getArgs() {
      throw new Error("getArgs is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processResult();
  },
};
