import dromo from "../../dromo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    dromo,
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
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    isRelevant() {
      throw new Error("isRelevant is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const resourceFn = this.getResourceFn();

    const imports = this.dromo.paginate({
      resourceFn,
    });
    for await (const item of imports) {
      const ts = Date.parse(item.modified_date);
      if (ts > lastTs && this.isRelevant(item)) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
      if (ts > maxTs) {
        maxTs = ts;
      }
    }

    this._setLastTs(maxTs);
  },
};
