const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-star",
  name: "New Stars (Instant)",
  version: "0.0.6",
  description: "Emit new events when a repo is starred",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "star",
      ];
    },
    getEventTypes() {
      return [
        "created",
      ];
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
