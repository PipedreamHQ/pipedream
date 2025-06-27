import dolibarr from "../../dolibarr.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    dolibarr,
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
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
    getArgs() {
      return {
        params: {
          sortfield: "date_creation",
          sortorder: "DESC",
        },
      };
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: item.date_creation,
      };
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    async processEvent(max) {
      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const results = this.dolibarr.paginate({
        fn: resourceFn,
        params: args,
        max,
      });
      const items = [];
      for await (const item of results) {
        if (item.date_creation > lastTs) {
          items.push(item);
          maxTs = Math.max(maxTs, item.date_creation);
        }
      }

      if (!items.length) {
        return;
      }

      this._setLastTs(maxTs);
      items.reverse().forEach(this.emitEvent);
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
      await this.processEvent(25);
    },
  },
  async run() {
    await this.processEvent();
  },
};
