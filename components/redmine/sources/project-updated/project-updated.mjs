import common from "../common/polling.mjs";

export default {
  ...common,
  key: "redmine-project-updated",
  name: "Project Updated",
  description: "Emits an event whenever a project is updated in Redmine",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "projects";
    },
    getResourceFn() {
      return this.app.listProjects;
    },
    getResourceFnArgs() {
      return {
        params: {
          sort: "updated_on:desc",
        },
      };
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_on);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Project Updated: ${resource.name}`,
        ts,
      };
    },
  },
};
