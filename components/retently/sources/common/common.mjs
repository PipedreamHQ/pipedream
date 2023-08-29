import retently from "../../retently.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    retently,
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
    async processEvent(limit) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      let count = 0;

      const items = await this.retently.paginate({
        fn: this.getResourceFn(),
        resultField: this.getResultField(),
      });

      for await (const item of items) {
        const ts = Date.parse(item.createdDate);
        if (ts > lastTs) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          if (ts > maxTs) {
            maxTs = ts;
          }
          count++;
          if (limit && count >= limit) {
            break;
          }
        }
      }

      this._setLastTs(maxTs);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResultField() {
      throw new Error("getResultField is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
