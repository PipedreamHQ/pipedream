import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-comment-created",
  name: "New Comment Created (Instant)",
  description: "Emit new event when a comment is created. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#webhooks)",
  version: "0.0.9",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookTypes() {
      return [
        "Comment",
      ];
    },
    getAllowedEvents() {
      return [
        "comment_created",
      ];
    },
  },
};
