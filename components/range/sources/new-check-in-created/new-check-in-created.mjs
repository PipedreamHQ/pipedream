import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "range-new-check-in-created",
  name: "New Check-In Created",
  description: "Emit new event when a new check-in is created. [See the docs](https://www.range.co/docs/api#rpc-list-updates).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    listUpdates(args = {}) {
      return this.app.makeRequest({
        path: "/updates",
        ...args,
      });
    },
    getResourcesFn() {
      return this.listUpdates;
    },
    getResourcesFnArgs() {
      const lastAfterTime = this.getLastAfterTime();

      const args = {
        params: {
          count: constants.DEFAULT_LIMIT,
          ascending: false,
        },
      };

      if (!lastAfterTime) {
        return args;
      }

      return {
        ...args,
        params: {
          ...args.params,
          after: lastAfterTime,
        },
      };
    },
    getResourcesName() {
      return "updates";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.endTime),
        summary: `New Check-In ID ${resource.id}`,
      };
    },
  },
};
