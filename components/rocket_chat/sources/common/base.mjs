import rocketchat from "../../rocket_chat.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    rocketchat,
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
      return this.db.get("lastTs") || this.oneDayAgo();
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    oneDayAgo() {
      return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        .slice(0, 19) + "Z";
    },
    getParams() {
      return {};
    },
    getResourceSubType() {
      return null;
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
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
    let maxTs = lastTs;

    const resourceFn = this.getResourceFn();
    const params = this.getParams();
    const resourceType = this.getResourceType();
    const resourceSubType = this.getResourceSubType();
    const items = this.rocketchat.paginate({
      resourceFn,
      params,
      resourceType,
      resourceSubType,
    });

    for await (const item of items) {
      if (Date.parse(item._updatedAt) > Date.parse(lastTs)) {
        if (Date.parse(item._updatedAt) > Date.parse(maxTs)) {
          maxTs = item._updatedAt;
        }
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    }

    this._setLastTs(maxTs);
  },
};
