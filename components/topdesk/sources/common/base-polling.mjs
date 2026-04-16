import topdesk from "../../topdesk.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    topdesk,
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
    _getPreviousValue() {
      return this.db.get("previousValue");
    },
    _setPreviousValue(previousValue) {
      this.db.set("previousValue", previousValue);
    },
    getArgs() {
      return {};
    },
    getTsField() {
      return "modificationDate";
    },
    paginateResults() {
      return false;
    },
    isRelevant() {
      return true;
    },
    async getPaginatedResources(opts = {}) {
      const results = this.topdesk.paginate(opts);
      const items = [];
      for await (const result of results) {
        items.push(result);
      }
      return items;
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      const tsField = this.getTsField();

      const results = this.paginateResults()
        ? await this.getPaginatedResources({
          fn: resourceFn,
          fnArgs: args,
          maxResults: max,
        })
        : [
          await resourceFn(args),
        ];

      if (!results.length) {
        return;
      }

      for (const result of results.reverse()) {
        const ts = Date.parse(result[tsField]);
        if (ts >= lastTs) {
          maxTs = Math.max(ts, maxTs);
          if (this.isRelevant(result)) {
            this.$emit(result, this.generateMeta(result));
          }
        }
      }

      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
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
