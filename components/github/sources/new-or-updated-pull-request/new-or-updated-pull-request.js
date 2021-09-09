const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-or-updated-pull-request",
  name: "New or Updated Pull Request (Instant)",
  description: "Emit new events when a pull request is opened or updated",
  version: "0.0.2",
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
        "edited",
        "closed",
        "assigned",
        "unassigned",
        "review_requested",
        "review_request_removed",
        "ready_for_review",
        "converted_to_draft",
        "labeled",
        "unlabeled",
        "syncronize",
        "auto_merge_enabled",
        "auto_merge_disabled",
        "locked",
        "unlocked",
        "reopened",
      ];
    },
    generateMeta(data, id) {
      const ts = data.pull_request.updated_at
        ? Date.parse(data.pull_request.updated_at)
        : Date.parse(data.pull_request.created_at);
      return {
        id,
        summary: `${data.pull_request.title} ${data.action} by ${data.sender.login}`,
        ts,
      };
    },
  },
};
