import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "beanstalkapp-new-repository-created",
  name: "New Repository Created",
  description: "Emit new event when a new repository is created. [See the docs](https://api.beanstalkapp.com/repository.html).",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "repository";
    },
    getResourceFn() {
      return this.app.listRepositories;
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
        id: resource.id,
        summary: `New Repository ${resource.name}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
