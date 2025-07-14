import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-conversation-comment",
  name: "New Conversation Comment (Internal Note)",
  description: "Emit new event when a new internal comment is added to a HubSpot conversation thread. [See the documentation](https://developers.hubspot.com/docs/api/conversations/threads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    threadId: {
      propDefinition: [
        common.props.hubspot,
        "threadId",
      ],
      description: "Filter comments from a specific conversation thread",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(comment) {
      return Date.parse(comment.createdAt);
    },
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: `New Internal Comment: ${comment.text || comment.id}`,
        ts: this.getTs(comment),
      };
    },
    isRelevant(comment, createdAfter) {
      const isAfterTimestamp = this.getTs(comment) > createdAfter;
      const matchesThread = !this.threadId || comment.threadId === this.threadId;
      const isComment = comment.type === "COMMENT";
      
      return isAfterTimestamp && matchesThread && isComment;
    },
    async getParams() {
      return {
        params: {
          limit: 100,
        },
      };
    },
    async processResults(after, params) {
      // Note: This is a placeholder implementation
      // In a real implementation, you would need to:
      // 1. List conversation threads
      // 2. For each thread, get messages
      // 3. Filter for COMMENT type messages
      // 4. Process events
      
      // For now, we'll use a webhook-based approach
      // This source would need to be enhanced with actual API calls
      // to poll for new comments if HubSpot doesn't provide webhooks
      
      console.log("Conversation comment polling not yet implemented - use webhooks instead");
    },
  },
};