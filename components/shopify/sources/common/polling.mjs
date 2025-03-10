import app from "../../shopify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    app,
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
    getResults() {
      throw new Error("getResults is not implemented");
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

    const results = await this.getResults();
    const tsField = this.getTsField();

    const items = [];
    for (const item of results) {
      const ts = Date.parse(item[tsField]);
      if (ts >= lastTs) {
        items.push(item);
        maxTs = Math.max(maxTs, ts);
      }
    }

    if (!items.length) {
      return;
    }

    this._setLastTs(maxTs);

    items.reverse().forEach((item) => this.emitEvent(item));
  },
};
