import qualiobee from "../../qualiobee.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    qualiobee,
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
    getParams() {
      return {};
    },
    getTsField() {
      return "creationDate";
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const fn = this.getResourceFn();
      const params = this.getParams();
      const tsField = this.getTsField();
      const results = this.qualiobee.paginate({
        resourceFn: fn,
        params,
        max,
      });
      for await (const item of results) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          maxTs = Math.max(ts, maxTs);
          this.$emit(item, this.generateMeta(item));
        }
      }
      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new ConfigurationError("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(10);
    },
  },
  async run() {
    await this.processEvent();
  },
};
