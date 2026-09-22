import donedone from "../../donedone.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    donedone,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountId: {
      propDefinition: [
        donedone,
        "accountId",
      ],
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
        sort: "created-recent",
      };
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.now(),
      };
    },
    async processEvents(max) {
      const lastId = this._getLastId();
      const results = [];
      const items = this.donedone.paginate({
        fn: this.getResourceFn(),
        accountId: this.accountId,
        params: this.getParams(),
        resourceKey: this.getResourceKey(),
        paginationKey: this.getPaginationKey(),
        max,
      });
      for await (const item of items) {
        if (item.id > lastId) {
          results.push(item);
        } else {
          break;
        }
      }
      if (!results.length) {
        return;
      }
      this._setLastId(results[0].id);
      results.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getResourceKey() {
      throw new ConfigurationError("getResourceKey is not implemented");
    },
    getPaginationKey() {
      throw new ConfigurationError("getPaginationKey is not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
