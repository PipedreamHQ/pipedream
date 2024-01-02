import coldstream from "../../coldstream.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "diabatix_coldstream-project-upgraded",
  name: "Project Upgraded",
  description: "Emits an event when a specific project has been upgraded or edited in ColdStream.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    coldstream,
    db: "$.service.db",
    asyncProjectId: {
      propDefinition: [
        coldstream,
        "asyncProjectId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5, // 5 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      return {
        id: data.id || `${data.updatedAt}`, // Use id if available, otherwise use updatedAt
        summary: `Project ${data.name} updated`,
        ts: Date.parse(data.updatedAt), // Use updatedAt as the timestamp
      };
    },
  },
  hooks: {
    async deploy() {
      // Fetch the current project data to initialize the state
      const projectData = await this.coldstream.getProject({
        projectId: this.asyncProjectId,
      });
      this.db.set("projectData", projectData);
    },
  },
  async run() {
    const lastProjectData = this.db.get("projectData");
    const currentProjectData = await this.coldstream.getProject({
      projectId: this.asyncProjectId,
    });

    if (JSON.stringify(lastProjectData) !== JSON.stringify(currentProjectData)) {
      this.$emit(currentProjectData, this.generateMeta(currentProjectData));
      this.db.set("projectData", currentProjectData);
    }
  },
};
