import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "smoove-new-list-created",
  name: "New List Created",
  description: "Emit new event when a new list is created. [See the docs](https://rest.smoove.io/#!/Lists/Lists_Get).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getLists(args = {}) {
      return this.app.makeRequest({
        path: "/Lists",
        ...args,
      });
    },
    getResourceFn() {
      return this.getLists;
    },
    getResourceFnArgs() {
      return {
        params: {
          itemsPerPage: constants.DEFAULT_LIMIT,
          sort: "-id",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.now(),
        summary: `New List Created ${resource.id}`,
      };
    },
  },
};
