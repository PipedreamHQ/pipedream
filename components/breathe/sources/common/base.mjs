import breathe from "../../breathe.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    breathe,
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
      return this.db.get("lastTs") || "1970-01-01";
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getArgs() {
      return {};
    },
    isRelevant() {
      return true;
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceKey() {
      throw new Error("getResourceKey is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const tsField = this.getTsField();

    const results = this.breathe.paginate({
      resourceFn: this.getResourceFn(),
      args: this.getArgs(lastTs),
      resourceKey: this.getResourceKey(),
    });

    for await (const item of results) {
      const ts = Date.parse(item[tsField]);
      if (ts >= Date.parse(lastTs)) {
        if (this.isRelevant(item)) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        }

        if (ts > Date.parse(maxTs)) {
          maxTs = item[tsField];
        }
      }
    }

    this._setLastTs(maxTs);
  },
};
