import proabono from "../../proabono.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    proabono,
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
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    async processEvent(max) {
      const lastId = this._getLastId();
      let maxId = lastId;
      const items = this.proabono.paginate({
        resourceFn: this.getResourceFn(),
        max,
      });
      const results = [];
      for await (const item of items) {
        if (item.Id > lastId) {
          results.push(item);
          if (item.Id > maxId) {
            maxId = item.Id;
          }
        }
      }
      if (!results.length) {
        return;
      }
      this._setLastId(maxId);
      results.forEach((item) => this.emitEvent(item));
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processEvent();
  },
};
