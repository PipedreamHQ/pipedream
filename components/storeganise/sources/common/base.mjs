import storeganise from "../../storeganise.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    storeganise,
    db: "$.service.db",
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
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const resourceFn = this.getResourceFn();
    const params = {
      limit: 100,
      offset: 0,
    };
    let total;
    do {
      const items = await resourceFn();
      total = items?.length;
      if (!total) {
        break;
      }
      for (const item of items) {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }
      params.offset += params.limit;
    } while (total === params.limit);
  },
};
