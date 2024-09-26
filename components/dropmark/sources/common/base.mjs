import dropmark from "../../dropmark.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    dropmark,
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
    getResourceType() {
      return false;
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
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
    const resourceType = this.getResourceType();

    const response = await resourceFn(args);
    const items = resourceType
      ? response[resourceType]
      : response;
    for (const item of items) {
      const ts = Date.parse(item.created_at);
      if (ts > lastTs) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
        maxTs = Math.max(ts, maxTs);
      }
    }

    this._setLastTs(maxTs);
  },
};
