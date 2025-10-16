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
      return {
        pageSize: 500,
        orderBy: "id desc",
      };
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
      const iterator = this.connectwise.paginate({
        resourceFn,
        params,
        max,
        lastId,
      });

      const items = [];
      let firstNewId;

      for await (const item of iterator) {
        if (!firstNewId) {
          firstNewId = item.id;
        }
        items.push(item);
      }

      if (firstNewId) {
        this._setLastId(firstNewId);
      }

      items
        .reverse()
        .forEach((item) => this.$emit(item, this.generateMeta(item)));
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
