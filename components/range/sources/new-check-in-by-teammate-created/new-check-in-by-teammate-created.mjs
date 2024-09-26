import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "range-new-check-in-by-teammate-created",
  name: "New Check-In By Teammate Created",
  description: "Emit new event when a new check-in by teammate is created. [See the docs](https://www.range.co/docs/api#rpc-list-updates).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.app,
        "userId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.listUpdates;
    },
    getResourcesFnArgs() {
      const lastPublishedAt = this.getLastPublishedAt();

      const args = {
        params: {
          target_id: this.userId,
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
