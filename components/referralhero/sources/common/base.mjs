import referralhero from "../../referralhero.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    referralhero,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
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
    getArgs() {
      throw new Error("getArgs is not implemented");
    },
    getResourceType() {
      throw new Error("getResourceType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      let count = 0;
      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const resourceType = this.getResourceType();

      const items = this.referralhero.paginate({
        resourceFn,
        args,
        resourceType,
      });

      for await (const item of items) {
        if (item.created_at > lastTs) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          if (item.created_at > maxTs) {
            maxTs = item.created_at;
          }
          count++;
          if (max && count >= max) {
            break;
          }
        }
      }

      this._setLastTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};
