import kenjo from "../../kenjo.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    kenjo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getResourceKey() {
      return;
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const resourceFn = this.getResourceFn();
    const resourceKey = this.getResourceKey();

    const results = await resourceFn();
    const items = resourceKey
      ? results[resourceKey]
      : results;

    for (const item of items) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
