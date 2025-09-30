import connectwise from "../../connectwise_psa.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    connectwise,
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
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getParams() {
      return {};
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.now(),
      };
    },
    async processEvent(max) {
      const lastId = this._getLastId();
      const resourceFn = this.getResourceFn();
      const params = this.getParams();
      const results = this.connectwise.paginate({
        resourceFn,
        params,
        max,
      });
      let items = [];
      for await (const item of results) {
        if (item.id > lastId) {
          items.push(item);
        }
      }
      if (!items.length) {
        return;
      }
      if (max) {
        items = items.slice(-1 * max);
      }
      this._setLastId(items[items.length - 1].id);
      items.forEach((item) => this.$emit(item, this.generateMeta(item)));
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
