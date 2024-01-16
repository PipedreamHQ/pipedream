import workamajig from "../../workamajig.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    workamajig,
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
    getResourceType() {
      throw new Error("getResourceType is not implemented");
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const resourceFn = this.getResourceFn();
    const params = this.getParams();
    const { data } = await resourceFn({
      params,
    });
    const items = data[this.getResourceType()];
    for (const item of items) {
      const ts = Date.parse(item[this.getTsField()]);
      if (ts > lastTs) {
        this.emitEvent(item);
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
    }

    this._setLastTs(maxTs);
  },
};
