import vtiger from "../../vtiger_crm.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    vtiger,
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
    getResources() {
      throw new Error("getResources is not implemented");
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

    const resources = await this.getResources(lastTs);
    for (const item of resources) {
      const ts = (Date.parse(item[this.getTsField()])) / 1000;
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
