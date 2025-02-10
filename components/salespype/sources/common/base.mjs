import salespype from "../../salespype.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    salespype,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLast() {
      return this.db.get("last") || 0;
    },
    _setLast(last) {
      this.db.set("last", last);
    },
    async processEvent(max) {
      const last = this._getLast();
      let maxLast = last;
      const resourceFn = this.getResourceFn();

      const items = this.salespype.paginate({
        fn: resourceFn,
        params: this.getParams(),
        resourceKey: this.getResourceKey(),
        max,
      });

      const results = [];
      for await (const item of items) {
        const fieldValue = this.getFieldValue(item);
        if (fieldValue >= last) {
          results.push(item);
          maxLast = Math.max(maxLast, fieldValue);
        }
      }

      if (!results.length) {
        return;
      }

      this._setLast(maxLast);

      results.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getParams() {
      return {
        order: "desc",
      };
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceKey() {
      throw new Error("getResourceKey is not implemented");
    },
    getFieldValue() {
      throw new Error("getFieldValue is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
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
