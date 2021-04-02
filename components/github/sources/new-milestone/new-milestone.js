const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-milestone",
  name: "New Milestone (Instant)",
  description: "Emit an event when a new milestone is created in a repo",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["milestone"];
    },
    getEventTypes() {
      return ["created"];
    },
    generateMeta(data) {
      const ts = new Date(data.milestone.created_at).getTime();
      return {
        id: data.milestone.id,
        summary: `${data.milestone.title} created by ${data.sender.login}`,
        ts: ts,
      };
    },
  },
};