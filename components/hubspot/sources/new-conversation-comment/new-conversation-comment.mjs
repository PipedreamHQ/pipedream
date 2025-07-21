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
      description: "The ID of the conversation thread to monitor for internal comments",
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
      const isComment = comment.type === "COMMENT";

      return isAfterTimestamp && isComment;
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

      // Get messages from the specified thread
      const messages = await this.hubspot.getConversationMessages({
        threadId: this.threadId,
        ...params,
      });

      const comments = messages.results?.filter((msg) =>
        this.isRelevant(msg, createdAfter)) || [];

      this.processEvents(comments);
    },
  },
};

