import { axios } from "@pipedream/platform";
import browserbase from "../../browserbase.app.mjs";

export default {
  key: "browserbase-new-project",
  name: "New Project Created",
  description: "Emit a new event when a new project is created. [See the documentation](https://docs.browserbase.com/reference/api/list-projects)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    browserbase,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const projects = await this.browserbase.listProjects();
      const recentProjects = projects.slice(-50);
      for (const project of recentProjects) {
        this.$emit(project, {
          id: project.id,
          summary: `New project: ${project.name}`,
          ts: new Date(project.createdAt).getTime(),
        });
      }
    },
  },
  methods: {
    async _getExistingProjectIds() {
      return this.db.get("projectIds") || [];
    },
    async _setExistingProjectIds(projectIds) {
      this.db.set("projectIds", projectIds);
    },
  },
  async run() {
    const existingProjectIds = await this._getExistingProjectIds();
    const projects = await this.browserbase.listProjects();

    for (const project of projects) {
      if (!existingProjectIds.includes(project.id)) {
        this.$emit(project, {
          id: project.id,
          summary: `New project: ${project.name}`,
          ts: new Date(project.createdAt).getTime(),
        });
        existingProjectIds.push(project.id);
      }
    }

    await this._setExistingProjectIds(existingProjectIds);
  },
};
