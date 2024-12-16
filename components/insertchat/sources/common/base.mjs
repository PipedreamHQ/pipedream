import insertchat from "../../insertchat.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    insertchat,
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
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    getArgs() {
      return {};
    },
    getTsField() {
      return "created_at";
    },
    generateMeta(item) {
      return {
        id: item.uid,
        summary: this.getSummary(item),
        ts: Date.parse(item[this.getTsField()]),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const items = this.insertchat.paginate({
        fn: resourceFn,
        args,
        max,
      });

      for await (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
          maxTs = Math.max(ts, maxTs);
        }
      }

      this._setLastTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};
