import centralstationcrm from "../../centralstationcrm.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    centralstationcrm,
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
      await this.processEvents(25);
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      let count = 0;

      const items = this.centralstationcrm.paginate({
        resourceFn: this.getResourceFn(),
      });

      for await (const item of items) {
        const resource = item[this.getResourceType()];
        const ts = Date.parse(resource.created_at);
        if (ts > lastTs) {
          const meta = this.generateMeta(resource);
          this.$emit(resource, meta);
          if (ts > maxTs) {
            maxTs = ts;
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
    await this.processEvents();
  },
};
