import upgradeChat from "../../upgrade_chat.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    upgradeChat,
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
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    getParams() {
      return {};
    },
    getTsField() {
      return "created";
    },
    generateMeta(item) {
      const ts = Date.parse(item[this.getTsField()]);
      return {
        id: `${item.uuid}-${ts}`,
        summary: this.getSummary(item),
        ts,
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const params = this.getParams();
      const tsField = this.getTsField();

      const items = this.upgradeChat.paginate({
        fn: resourceFn,
        params,
      });

      let results = [];
      for await (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          results.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }
      this._setLastTs(maxTs);

      if (max && results.length > max) {
        results = results.slice(-1 * max);
      }

      for (const item of results) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
