import detectify from "../../detectify.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    detectify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    domainToken: {
      propDefinition: [
        detectify,
        "domainToken",
      ],
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTs(item) {
      return item.created_at;
    },
    getArgs() {
      return {};
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceType() {
      return null;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const resourceFn = this.getResourceFn();
    const args = this.getArgs(lastTs);
    const resourceType = this.getResourceType();

    let results = await resourceFn(args);
    if (resourceType) {
      results = results[resourceType];
    }

    for (const item of results) {
      const ts = this.getTs(item);
      if (!lastTs || Date.parse(ts) >= Date.parse(lastTs)) {
        maxTs = !maxTs || Date.parse(ts) > Date.parse(maxTs)
          ? ts
          : maxTs;
        this.$emit(item, this.generateMeta(item));
      }
    }

    this._setLastTs(maxTs);
  },
};
