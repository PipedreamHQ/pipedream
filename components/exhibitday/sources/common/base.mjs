import exhibitday from "../../exhibitday.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    exhibitday,
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
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const resourceFn = this.getResourceFn();
    const args = this.getArgs();

    const { list_data: items } = await resourceFn(args);
    for (const item of items) {
      const ts = Date.parse(item[this.getTsField()]);
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
};
