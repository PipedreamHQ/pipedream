import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "missive-new-comment-instant",
  name: "New Comment (Instant)",
  description: "Emit new event when a new comment is added. [See the Documentation](https://missiveapp.com/help/api-documentation/webhooks)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.NEW_COMMENT;
    },
    generateMeta(body) {
      const { comment } = body;
      return {
        id: comment.id,
        summary: `New Comment: ${comment.id}`,
        ts: comment.created_at,
      };
    },
  },
};
