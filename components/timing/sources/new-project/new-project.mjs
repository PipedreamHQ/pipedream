import timing from "../../timing.app.mjs";

export default {
  key: "timing-new-project",
  name: "New Project Created",
  description: "Emits an event each time a new project is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    timing,
    db: "$.service.db",
    userCredentials: timing.propDefinitions.userCredentials,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    ...timing.methods,
    checkNewProjects: async function () {
      const lastProjectId = this.db.get("lastProjectId") || 0;
      const params = {
        $: this,
        method: "GET",
        path: "/projects",
      };
      const { data } = await this._makeRequest(params);
      const newProjects = data.filter((project) => project.id > lastProjectId);
      if (newProjects.length > 0) {
        this.db.set("lastProjectId", Math.max(...newProjects.map((project) => project.id)));
      }
      return newProjects;
    },
  },
  async run() {
    const newProjects = await this.checkNewProjects();
    for (const project of newProjects) {
      this.$emit(project, {
        id: project.id,
        summary: `New project created: ${project.name}`,
        ts: Date.now(),
      });
    }
  },
};
