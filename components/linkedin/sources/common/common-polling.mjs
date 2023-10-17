import linkedin from "../../linkedin.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    linkedin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async *paginate({
      resourceFn, resourceKey, args = {},
    }) {
      let total = 0;
      args = {
        ...args,
        params: {
          ...args.params,
          start: 0,
          count: 50,
        },
      };
      do {
        const response = await resourceFn(args);
        const items = response[resourceKey];
        for (const item of items) {
          yield item;
        }
        args.params.start += args.params.count;
        total = items?.length;
      } while (total === args.params.count);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
};
