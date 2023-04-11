import common from "../common/base.mjs";

export default {
  ...common,
  key: "meister-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created. [See the docs](https://developers.meistertask.com/reference/get-projects)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.meistertask.listProjects;
    },
    generateMeta(project) {
      return {
        id: project.id,
        summary: project.name,
        ts: Date.parse(project.created_at),
      };
    },
  },
};
