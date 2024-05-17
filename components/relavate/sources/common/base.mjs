import relavate from "../../relavate.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    relavate,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getStartDate() {
      return this.db.get("startDate") || this._today();
    },
    _setStartDate(startDate) {
      this.db.set("startDate", startDate);
    },
    _today() {
      return new Date().toISOString()
        .split("T")[0];
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: Date.parse(item.created_at),
      };
    },
    getParams() {
      return {};
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run() {
    const resourceFn = this.getResourceFn();
    const params = this.getParams();
    const results = await resourceFn({
      params,
    });
    if (!results?.length) {
      return;
    }
    for (const item of results) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
