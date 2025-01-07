import taleez from "../../taleez.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    taleez,
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const tsField = this.getTsField();

      const results = this.taleez.paginate({
        fn: this.getResourceFn(),
        args: this.getArgs(),
        max,
      });

      for await (const item of results) {
        if (tsField) {
          const ts = item[tsField];
          if (ts > lastTs) {
            this.emitEvent(item);
            maxTs = Math.max(ts, maxTs);
          }
        } else {
          this.emitEvent(item);
        }
      }

      this._setLastTs(maxTs);
    },
    getArgs() {
      return {};
    },
    getTsField() {
      return undefined;
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
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
