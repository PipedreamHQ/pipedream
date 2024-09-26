import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "timing-new-project",
  name: "New Project Created",
  description: "Emit new event each time a new project is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(project) {
      return {
        id: project.self,
        summary: `New Project: ${project.title}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const { data } = await this.timing.listProjects();
    for (const project of data) {
      const meta = this.generateMeta(project);
      this.$emit(project, meta);
    }
  },
  sampleEmit,
};
