const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-or-updated-milestone",
  name: "New or Updated Milestone (Instant)",
  description:
    "Emit new events when a milestone is created or updated in a repo",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "milestone",
      ];
    },
    getEventTypes() {
      return [
        "created",
        "edited",
        "opened",
        "closed",
        "deleted",
      ];
    },
    generateMeta(data, id) {
      const ts = data.milestone.updated_at
        ? Date.parse(data.milestone.updated_at)
        : Date.parse(data.milestone.created_at);
      return {
        id,
        summary: `${data.milestone.title} ${data.action} by ${data.sender.login}`,
        ts,
      };
    },
  },
};
