const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-star",
  name: "New Stars (Instant)",
  version: "0.0.3",
  description: "Emit an event when a repo is starred",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["star"];
    },
    getEventTypes() {
      return ["created"];
    },
    generateMeta(data) {
      const ts = new Date(data.starred_at).getTime();
      return {
        id: `${data.repository.id}${ts}`,
        summary: `${data.sender.login} starred ${this.repoFullName}`,
        ts,
      };
    },
  },
};