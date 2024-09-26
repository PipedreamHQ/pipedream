import addevent from "../../addevent.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    addevent,
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
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getParams() {
      throw new Error("getParams is not implemented");
    },
    getResourceType() {
      throw new Error("getResourceType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const tsField = this.getTsField();

    const items = this.addevent.paginate({
      resourceFn: this.getResourceFn(),
      params: this.getParams(),
      resourceType: this.getResourceType(),
    });

    const results = [];
    for await (const item of items) {
      const ts = Date.parse(item[tsField]);
      if (ts > lastTs) {
        results.push(item);
      }
    }

    if (!results.length) {
      return;
    }

    this._setLastTs(Date.parse(results[0][tsField]));

    results.reverse().forEach((item) => {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    });
  },
};
