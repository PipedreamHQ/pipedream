import common from "../common/polling.mjs";

export default {
  ...common,
  key: "craftboxx-new-project",
  name: "New Project",
  description: "Emit new event when a new project is created in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "data";
    },
    getResourcesFn() {
      return this.app.listProjects;
    },
    getResourcesFnArgs() {
      return {
        params: {
          order_by: "created_at",
          order_direction: "desc",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Project: ${resource.title}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
