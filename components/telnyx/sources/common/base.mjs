import telnyxApp from "../../telnyx.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    telnyxApp,
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
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getParams() {
      return {};
    },
    getTs() {
      return new Date().toISOString();
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const resourceFn = this.getResourceFn();
      const params = this.getParams(lastTs);

      const results = this.telnyxApp.paginate({
        resourceFn,
        params,
        max,
      });

      for await (const item of results) { console.log(item);
        const ts = this.getTs(item);
        if (Date.parse(ts) >= Date.parse(lastTs)) {
          maxTs = Date.parse(ts) > Date.parse(maxTs)
            ? ts
            : maxTs;
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        }
      }

      this._setLastTs(maxTs);
    },
  },
  async run() {
    await this.processEvent();
  },
};
