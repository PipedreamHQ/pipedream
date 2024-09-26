import moxie from "../../moxie.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    moxie,
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
    emitEvent(resource) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    getTsKey() {
      throw new Error("getTsKey is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;

    const resources = await this.getResources();

    for (const resource of resources) {
      const ts = Date.parse(resource[this.getTsKey()]);
      if (ts > lastTs) {
        this.emitEvent(resource);
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
    }

    this._setLastTs(maxTs);
  },
};
