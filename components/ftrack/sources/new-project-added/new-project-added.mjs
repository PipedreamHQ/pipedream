import common from "../common/polling.mjs";

export default {
  ...common,
  key: "ftrack-new-project-added",
  name: "New Project Added",
  description: "Triggered when a new task is added. [See the documentation](https://help.ftrack.com/en/articles/1040498-operations#query)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listProjects;
    },
    getResourceFnArgs() {
      const lastCreatedAt = this.getLastCreatedAt();

      if (!lastCreatedAt) {
        return;
      }

      return {
        data: {
          where: `created_at > "${lastCreatedAt}"`,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Project: ${resource.id}`,
        ts: Date.parse(resource.created_at?.value),
      };
    },
  },
};
