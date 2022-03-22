const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-pull-request",
  name: "New Pull Request (Instant)",
  description: "Emit new event on new pull requests",
  version: "0.0.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "pull_request",
      ];
    },
    getEventTypes() {
      return [
        "opened",
      ];
    },
    generateMeta(data) {
      const ts = new Date(data.pull_request.updated_at).getTime();
      return {
        id: data.pull_request.id,
        summary: `${data.pull_request.title} created by ${data.sender.login}`,
        ts,
      };
    },
  },
};
