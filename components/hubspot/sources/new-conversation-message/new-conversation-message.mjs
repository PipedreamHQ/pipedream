import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-conversation-message",
  name: "New Conversation Message",
  description: "Emit new event when a new message is added to a HubSpot conversation thread. [See the documentation](https://developers.hubspot.com/docs/api/conversations/threads)",
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
      description: "The ID of the conversation thread to monitor for messages",
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "Filter by message type",
      options: [
        {
          label: "All Messages",
          value: "",
        },
        {
          label: "Regular Messages",
          value: "MESSAGE",
        },
        {
          label: "Internal Comments",
          value: "COMMENT",
        },
      ],
      default: "",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getTs(message) {
      return Date.parse(message.createdAt);
    },
    generateMeta(message) {
      const messageType = message.type === "COMMENT"
        ? "Internal Comment"
        : "Message";
      return {
        id: message.id,
        summary: `New ${messageType}: ${message.text || message.id}`,
        ts: this.getTs(message),
      };
    },
    isRelevant(message, createdAfter) {
      const isAfterTimestamp = this.getTs(message) > createdAfter;
      const matchesType = !this.messageType || message.type === this.messageType;

      return isAfterTimestamp && matchesType;
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

      const relevantMessages = messages.results?.filter((msg) =>
        this.isRelevant(msg, createdAfter)) || [];

      this.processEvents(relevantMessages);
    },
  },
};