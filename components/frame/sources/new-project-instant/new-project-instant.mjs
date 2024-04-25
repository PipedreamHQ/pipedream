import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frame-new-project-instant",
  name: "New Project (Instant)",
  description: "Emit new event when a new project is created. [See the documentation](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)",
  version: "0.1.0",
  type: "source",
  sampleEmit,
  methods: {
    ...common.methods,
    getSummary() {
      return "New Project";
    },
    getHookData() {
      return [
        "project.created",
      ];
    },
    async getResourceData(id) {
      return this.app.getProject(id);
    },
  },
};
