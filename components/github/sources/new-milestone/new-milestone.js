const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-milestone",
  name: "New Milestone (Instant)",
  description: "Emit new events when new milestones are created in a repo",
  version: "0.0.6",
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
      ];
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
