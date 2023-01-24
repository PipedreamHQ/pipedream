import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "range-new-check-in-created",
  name: "New Check-In Created",
  description: "Emit new event when a new check-in is created. [See the docs](https://www.range.co/docs/api#rpc-list-updates).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.listUpdates;
    },
    getResourcesFnArgs() {
      const lastPublishedAt = this.getLastPublishedAt();

      const args = {
        params: {
          count: constants.DEFAULT_LIMIT,
          ascending: false,
        },
      };

      if (!lastPublishedAt) {
        return args;
      }

      return {
        ...args,
        params: {
          ...args.params,
          after: lastPublishedAt,
        },
      };
    },
    getResourcesName() {
      return "updates";
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.published_at);
      return {
        id: ts,
        ts,
        summary: `New Check-In at ${resource.published_at}`,
      };
    },
  },
};
