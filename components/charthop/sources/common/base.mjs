import charthop from "../../charthop.app.mjs";
import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  props: {
    charthop,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    orgId: {
      propDefinition: [
        charthop,
        "orgId",
      ],
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.now(),
      };
    },
    emitEvents(items) {
      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getArgs() {
      return {
        orgId: this.orgId,
      };
    },
    async getResults() {
      const lastId = this._getLastId();
      const resourceFn = this.getResourceFn();
      const args = this.getArgs();

      if (lastId) {
        args.params = {
          ...args.params,
          from: lastId,
        };
      }

      const items = this.charthop.paginate({
        resourceFn,
        args,
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
      }

      if (results.length) {
        this._setLastId(results[results.length - 1].id);
      }

      return results;
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
    },
  },
  hooks: {
    async deploy() {
      const results = await this.getResults();
      this.emitEvents(results.slice(-25));
    },
  },
  async run() {
    const results = await this.getResults();
    this.emitEvents(results);
  },
};
