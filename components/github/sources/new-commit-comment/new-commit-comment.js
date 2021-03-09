const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "github-new-commit-comment",
  name: "New Commit Comment (Instant)",
  description: "Emit an event when a new commit comment is created",
  version: "0.0.3",
  methods: {
    ...common.methods,
    getEventNames() {
      return ["commit_comment"];
    },
    getEventTypes() {
      return ["created"];
    },
    generateMeta(data) {
      const ts = new Date(data.comment.created_at).getTime();
      return {
        id: data.comment.id,
        summary: `${data.comment.user.login}: ${data.comment.body}`,
        ts,
      };
    },
  },
};