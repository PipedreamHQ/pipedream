const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-commit-comment",
  name: "New Commit Comment (Instant)",
  description: "Emit new events on new commit comments",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return [
        "commit_comment",
      ];
    },
    getEventTypes() {
      return [
        "created",
      ];
    },
    generateMeta(data, id) {
      const ts = data.comment.updated_at
        ? Date.parse(data.comment.updated_at)
        : Date.parse(data.comment.created_at);
      return {
        id,
        summary: `${data.comment.user.login}: ${data.comment.body}`,
        ts,
      };
    },
  },
};
