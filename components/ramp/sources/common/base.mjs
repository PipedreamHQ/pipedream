import ramp from "../../ramp.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    ramp,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getPreviousStatuses() {
      return this.db.get("previousStatuses") || {};
    },
    _setPreviousStatuses(previousStatuses) {
      this.db.set("previousStatuses", previousStatuses);
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    emitResults() {
      throw new Error("emitResults is not implemented");
    },
    getParams() {
      return {};
    },
    async processEvent(max) {
      const resourceFn = this.getResourceFn();
      const params = this.getParams();

      const items = this.ramp.paginate({
        resourceFn,
        params,
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
      }
      if (!results.length) {
        return;
      }
      await this.emitResults(results, max);
    },
  },
  async run() {
    await this.processEvent();
  },
};
