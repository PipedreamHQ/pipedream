const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-project-card",
  name: "New Project Card (Instant)",
  description: "Emit an event when a new project card is created",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["project_card"];
    },
    getEventTypes() {
      return ["created"];
    },
    generateMeta(data) {
      const ts = new Date(data.project_card.created_at).getTime();
      return {
        id: data.project_card.id,
        summary: `Project Card #${data.project_card.id} added by ${data.sender.login}`,
        ts,
      };
    },
  },
};