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
      const createdAfter = after || this.getLastCreatedAt();
      
      if (this.threadId) {
        // If specific thread is provided, get messages from that thread
        const messages = await this.hubspot.getConversationMessages({
          threadId: this.threadId,
          ...params,
        });
        
        const comments = messages.results?.filter(msg => 
          this.isRelevant(msg, createdAfter)
        ) || [];
        
        this.processEvents(comments);
      } else {
        // Note: HubSpot Conversations API doesn't provide a direct way to list all threads
        // This would require HubSpot webhooks or a different approach
        console.log("Thread-specific monitoring recommended - provide threadId prop for best results");
      }
    },
  },
};