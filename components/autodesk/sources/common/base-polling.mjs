import autodesk from "../../autodesk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    autodesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async processEvent(max) {
      const items = this.autodesk.paginate({
        fn: this.getFn(),
        args: this.getArgs(),
        max,
      });

      const results = [];
      for await (const item of items) {
        results.push(item);
      }

      results.forEach((result) => {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      });
    },
    getFn() {
      throw new Error("getFn is not implemented");
    },
    getArgs() {
      return {};
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
