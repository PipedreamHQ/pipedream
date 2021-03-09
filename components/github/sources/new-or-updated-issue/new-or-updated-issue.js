const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-or-updated-issue",
  name: "New or Updated Issue (Instant)",
  description: "Emit an event when an issue is opened or updated.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["issues"];
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
    generateMeta(data) {
      const ts = new Date(data.issue.updated_at).getTime();
      return {
        id: `${data.issue.id}${ts}`,
        summary: `#${data.issue.number} ${data.issue.title} ${data.action} by ${data.sender.login}`,
        ts,
      };
    },
  },
};