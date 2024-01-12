import oyster from "../../oyster.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    oyster,
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
      await this.processEvent(1, 25);
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    async processEvent(lastTs, max) {
      let maxTs = lastTs;
      const paginatedItems = this.oyster.paginate({
        resourceFn: this.getResourceFn(),
        max,
      });
      const results = [];
      for await (const item of paginatedItems) {
        if (lastTs) {
          const ts = Date.parse(item[this.getTsField()]);
          if (ts > lastTs) {
            results.push(item);
            if (ts > maxTs) {
              maxTs = ts;
            }
          }
        } else {
          results.push(item);
        }
        if (max && results.length === max) {
          break;
        }
      }
      if (maxTs) {
        this._setLastTs(maxTs);
      }
      results.reverse().forEach((item) => this.emitEvent(item));
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    await this.processEvent(lastTs);
  },
};
