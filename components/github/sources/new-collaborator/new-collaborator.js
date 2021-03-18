const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-collaborator",
  name: "New Collaborator (Instant)",
  description: "Emit an event when a new collaborator is added to a repo",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["member"];
    },
    getEventTypes() {
      return ["added"];
    },
    generateMeta(data) {
      const ts = Date.now();
      return {
        id: data.member.id,
        summary: `${data.sender.login} added to ${this.repoFullName}`,
        ts,
      };
    },
  },
};