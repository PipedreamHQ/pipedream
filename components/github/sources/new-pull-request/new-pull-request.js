const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-pull-request",
  name: "New Pull Request (Instant)",
  description: "Emit an event when a new pull request is opened",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["pull_request"];
    },
    getEventTypes() {
      return ["opened"];
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