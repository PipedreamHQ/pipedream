const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-commit-comment",
  name: "New Commit Comment (Instant)",
  description: "Emit an event when a new commit comment is created",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["commit_comment"];
    },
    getEventTypes() {
      return ["created"];
    },
    generateMeta(data) {
      const ts = data.comment.updated_at
        ? Date.parse(data.comment.updated_at)
        : Date.parse(data.comment.created_at);
      return {
        id: `${data.comment.id}${ts}`,
        summary: `${data.comment.user.login}: ${data.comment.body}`,
        ts,
      };
    },
  },
};