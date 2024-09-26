import riskadvisor from "../../riskadvisor.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    riskadvisor,
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
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    gettResourceFn() {
      throw new Error("gettResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const items = this.riskadvisor.paginate({
        resourceFn: this.getResourceFn(),
      });

      let count = 0;
      for await (const item of items) {
        const ts = Date.parse(item[this.getTsField()]);
        if (ts > lastTs) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
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
