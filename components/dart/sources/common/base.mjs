import dart from "../../dart.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    dart,
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
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const tsField = this.getTsField();

      const items = this.dart.paginate({
        resourceFn,
        max,
      });
      for await (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }
      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
