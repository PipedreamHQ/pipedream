import flutterwave from "../../flutterwave.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    flutterwave,
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
      await this.processEvents(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    getTsField() {
      return "created_at";
    },
    getParams() {
      return {};
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    formatDate(ts) {
      const date = new Date(ts);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      const resourceFn = this.getResourceFn();
      const params = this.getParams(lastTs);
      const results = [];

      const items = this.flutterwave.paginate({
        resourceFn,
        params,
      });

      for await (const item of items) {
        const ts = Date.parse(item[this.getTsField()]);
        if (ts > lastTs) {
          results.push(item);
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
        if (max && results.length === max) {
          break;
        }
      }

      results.reverse().forEach((item) => this.emitEvent(item));
      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    await this.processEvents();
  },
};
