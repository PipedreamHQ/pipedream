import common from "../common/common.mjs";

export default {
  ...common,
  key: "frame-new-project-instant",
  name: "New Project (Instant)",
  description: "Emit new event when a new project is created. [See the documentation](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getSummary() {
      return "New Asset";
    },
    getHookData() {
      return [
        "project.created",
      ];
    },
  },
};
