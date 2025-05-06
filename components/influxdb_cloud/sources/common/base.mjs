import influxDbCloud from "../../influxdb_cloud.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    influxDbCloud,
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
      return "createdAt";
    },
    generateMeta(item) {
      const ts = Date.parse(item[this.getTsField()]);
      return {
        id: `${item.id}${ts}`,
        summary: this.getSummary(item),
        ts,
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      const fn = this.getResourceFn();
      const params = this.getParams();
      const resourceKey = this.getResourceKey();
      const tsField = this.getTsField();

      const results = this.influxDbCloud.paginate({
        fn,
        params,
        resourceKey,
      });

      let items = [];
      for await (const item of results) {
        const ts = Date.parse(item[tsField]);
        if (ts > lastTs) {
          items.push(item);
          maxTs = Math.max(ts, maxTs);
        }
      }

      if (max && items?.length > max) {
        items = items.slice(-1 * max);
      }

      items.forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });

      this._setLastTs(maxTs);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getResourceKey() {
      throw new Error("getResourceKey is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
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
