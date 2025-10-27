import sharepoint from "../../sharepoint.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    sharepoint,
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
    isSortedDesc() {
      return false;
    },
    isRelevant() {
      return true;
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
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const fn = this.getResourceFn();
    const args = this.getArgs();
    const items = this.sharepoint.paginate({
      fn,
      args,
    });

    let count = 0;
    for await (const item of items) {
      const ts = Date.parse(item[this.getTsField()]);
      if (ts > lastTs) {
        if (this.isRelevant(item) && (lastTs || count < 10)) {
          this.emitEvent(item);
          count++;
        }
        if (ts > maxTs) {
          maxTs = ts;
        }
      } else if (this.isSortedDesc()) {
        break;
      }
    }

    this._setLastTs(maxTs);
  },
};
