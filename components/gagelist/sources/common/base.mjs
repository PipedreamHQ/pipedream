import gagelist from "../../gagelist.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    gagelist,
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
    getParams() {
      return {};
    },
    generateMeta(item) {
      return {
        id: item.Id,
        summary: this.getSummary(item),
        ts: Date.parse(this.getTsField(item)),
      };
    },
    async getResources(resourceFn, params) {
      const resources = [];
      const items = this.gagelist.paginate({
        resourceFn,
        params,
      });
      for await (const item of items) {
        resources.push(item);
      }
      return resources.reverse();
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const params = this.getParams();
      const tsField = this.getTsField();

      const items = await this.getResources(resourceFn, params);

      let newItems = [];
      for (const item of items) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          newItems.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }
      this._setLastTs(maxTs);

      if (max) {
        newItems = newItems.slice(0, max);
      }

      newItems.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getTsField() {
      throw new Error("getTsField is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
