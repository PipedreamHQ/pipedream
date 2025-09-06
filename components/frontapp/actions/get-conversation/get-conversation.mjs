import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-conversation",
  name: "Get Conversation",
  description: "Retrieve a conversation by its ID from Front. [See the documentation](https://dev.frontapp.com/reference/get-conversation-by-id)",
  version: "0.0.3",
  type: "action",
  props: {
    frontapp,
    conversationId: {
      propDefinition: [
        frontapp,
        "conversationId",
      ],
    },
    includeMessages: {
      type: "boolean",
      label: "Include Messages",
      description: "Whether to include all messages from the conversation",
      default: false,
      optional: true,
    },
  },
  async run({ $ }) {
    const conversation = await this.frontapp.getConversation({
      $,
      conversationId: this.conversationId,
    });

    if (this.includeMessages) {
      const messages = [];
      for await (const message of this.frontapp.paginate({
        fn: this.frontapp.makeRequest,
        path: `/conversations/${this.conversationId}/messages`,
      })) {
        messages.push(message);
      }
      conversation.messages = messages;
    }

    $.export("$summary", `Successfully retrieved conversation with ID: ${this.conversationId}`);

    return conversation;
  },
};
