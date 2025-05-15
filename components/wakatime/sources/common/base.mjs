import wakatime from "../../wakatime.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    wakatime,
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
    getResourceKey() {
      return "data";
    },
    getTsField() {
      return "created_at";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item[this.getTsField()]),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const resourceKey = this.getResourceKey();
      const tsField = this.getTsField();

      const results = this.wakatime.paginate({
        fn: resourceFn,
        args,
        resourceKey,
      });

      let items = [];
      for await (const item of results) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          items.push(item);
          maxTs = Math.max(maxTs, ts);
        }
      }

      if (!items.length) {
        return;
      }

      if (max && items.length >= max) {
        items = items.slice(0, max);
      }

      this._setLastTs(maxTs);

      for (const item of items.reverse()) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
