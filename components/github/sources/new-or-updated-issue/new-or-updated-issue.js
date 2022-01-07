const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-or-updated-issue",
  name: "New or Updated Issue (Instant)",
  description: "Emit new events when an issue is opened or updated",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "issues",
      ];
    },
    getEventTypes() {
      return [
        "opened",
        "edited",
        "deleted",
        "pinned",
        "unpinned",
        "closed",
        "reopened",
        "assigned",
        "unasigned",
        "labeled",
        "unlabeled",
        "locked",
        "unlocked",
        "transfered",
        "milestoned",
        "demilestoned",
      ];
    },
    generateMeta(data, id) {
      const ts = data.issue.updated_at
        ? Date.parse(data.issue.updated_at)
        : Date.parse(data.issue.created_at);
      return {
        id,
        summary: `#${data.issue.number} ${data.issue.title} ${data.action} by ${data.sender.login}`,
        ts,
      };
    },
  },
};
