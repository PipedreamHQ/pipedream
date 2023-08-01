import common from "../common/base.mjs";

export default {
  ...common,
  key: "zoho_sprints-new-project-created",
  name: "New Project Created (Instant)",
  description: "Emit new event when a new project is created in Zoho Sprints.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModule() {
      return "0"; // 0 = Project
    },
    getEventType() {
      return "project_create";
    },
    generateMeta() {
      return {
        id: Date.now(),
        summary: "New Project Created",
        ts: Date.now(),
      };
    },
  },
};
