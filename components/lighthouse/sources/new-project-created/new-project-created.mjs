import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Project Created",
  version: "0.0.1",
  key: "lighthouse-new-project-created",
  description: "Emit new event for each new project created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent({ project }) {
      this.$emit(project, {
        id: project.id,
        summary: `New project created with ID ${project.id}`,
        ts: Date.parse(project.created_at),
      });
    },
    async getResources(args = {}) {
      const { projects } = await this.lighthouse.getProjects({
        ...args,
        projectId: this.projectId,
      });

      return projects;
    },
    resourceKey() {
      return "project";
    },
  },
};
