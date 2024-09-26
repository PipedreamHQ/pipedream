import helpcrunch from "../../helpcrunch.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    helpcrunch,
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
    async getResources(resourceFn) {
      const results = [];
      const items = this.helpcrunch.paginate({
        resourceFn,
      });
      for await (const item of items) {
        results.push(item);
      }
      return results;
    },
    sortResults(results, key) {
      return results.sort((a, b) => a[key] > b[key]
        ? 1
        : -1);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getKey() {
      throw new Error("getKey is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const last = this._getLast();
    let max = last;
    const resourceFn = this.getResourceFn();
    const key = this.getKey();

    const results = await this.getResources(resourceFn);
    const sortedResults = this.sortResults(results, key);

    for (const item of sortedResults) {
      if (item[key] > last) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
      if (item[key] > max) {
        max = item[key];
      }
    }

    this._setLast(max);
  },
};
