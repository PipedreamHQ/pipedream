import forcemanager from "../../forcemanager.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    forcemanager,
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item.dateCreated),
      };
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      const resourceFn = this.getResourceFn();
      const results = this.forcemanager.paginate({
        resourceFn,
        args: {
          params: {
            order: "dateCreated",
          },
        },
        max,
      });
      const items = [];
      for await (const item of results) {
        const ts = Date.parse(item.dateCreated);
        if (ts > lastTs) {
          items.push(item);
        } else {
          break;
        }
      }
      if (!items?.length) {
        return;
      }
      this._setLastTs(Date.parse(items[0].dateCreated));
      items.reverse().forEach((item) => this.emitEvent(item));
    },
  },
  async run() {
    await this.processEvent();
  },
};
