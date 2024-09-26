import goody from "../../goody.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    goody,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const items = this.goody.paginate({
      resourceFn: this.getResourceFn(),
    });

    for await (const item of items) {
      if (this.isRelevant(item)) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
    }
  },
};
