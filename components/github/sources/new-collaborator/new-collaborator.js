const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-collaborator",
  name: "New Collaborator (Instant)",
  description: "Emit new events when collaborators are added to a repo",
  version: "0.0.4",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "member",
      ];
    },
    getEventTypes() {
      return [
        "added",
      ];
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
