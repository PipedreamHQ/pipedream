import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "beanstalkapp-new-changeset-created",
  name: "New Changeset Created",
  description: "Emit new event when a new changeset is created. [See the docs](https://api.beanstalkapp.com/changeset.html).",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "revision_cache";
    },
    getResourceFn() {
      return this.app.listChangesets;
    },
    getResourceFnArgs() {
      return {
        params: {
          per_page: constants.DEFAULT_LIMIT,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.revision,
        summary: `New Changeset ${resource.revision}`,
        ts: Date.parse(resource.time),
      };
    },
  },
};
