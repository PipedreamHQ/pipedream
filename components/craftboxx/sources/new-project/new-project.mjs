import craftboxx from "../../craftboxx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "craftboxx-new-project",
  name: "New Project Created",
  description: "Emits an event when a new project is created in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    craftboxx,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    projectDetails: {
      propDefinition: [
        craftboxx,
        "projectDetails",
      ],
    },
  },
  methods: {
    generateMeta(project) {
      return {
        id: project.id,
        summary: `New Project: ${project.name}`,
        ts: Date.parse(project.created_at),
      };
    },
  },
  hooks: {
    async deploy() {
      const projects = await this.craftboxx.createProject(this.projectDetails);

      // Emit at most 50 events in order of most recent to least recent
      const recentProjects = projects.slice(-50).reverse();

      for (const project of recentProjects) {
        this.$emit(project, this.generateMeta(project));
      }

      // Store the timestamp of the most recent project
      if (projects.length > 0) {
        this.db.set("lastProjectTimestamp", recentProjects[0].created_at);
      }
    },
  },
  async run() {
    const lastProjectTimestamp = this.db.get("lastProjectTimestamp");
    const params = lastProjectTimestamp
      ? {
        since: lastProjectTimestamp,
      }
      : {};
    const projects = await this.craftboxx.createProject({
      ...this.projectDetails,
      ...params,
    });

    for (const project of projects) {
      if (new Date(project.created_at) > new Date(lastProjectTimestamp)) {
        this.$emit(project, this.generateMeta(project));
      }
    }

    // Update state with the most recent project timestamp
    if (projects.length > 0) {
      this.db.set("lastProjectTimestamp", projects[0].created_at);
    }
  },
};
