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
      description: "Filter messages from a specific conversation thread",
      optional: true,
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
      const messageType = message.type === "COMMENT" ? "Internal Comment" : "Message";
      return {
        id: message.id,
        summary: `New ${messageType}: ${message.text || message.id}`,
        ts: this.getTs(message),
      };
    },
    isRelevant(message, createdAfter) {
      const isAfterTimestamp = this.getTs(message) > createdAfter;
      const matchesThread = !this.threadId || message.threadId === this.threadId;
      const matchesType = !this.messageType || message.type === this.messageType;
      
      return isAfterTimestamp && matchesThread && matchesType;
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
      // 3. Filter based on timestamp and props
      // 4. Process events
      
      // For now, we'll use a webhook-based approach
      // This source would need to be enhanced with actual API calls
      // to poll for new messages if HubSpot doesn't provide webhooks
      
      console.log("Conversation message polling not yet implemented - use webhooks instead");
    },
  },
};