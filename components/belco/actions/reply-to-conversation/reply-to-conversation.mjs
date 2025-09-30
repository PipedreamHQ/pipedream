import belco from "../../belco.app.mjs";

export default {
  key: "belco-reply-to-conversation",
  name: "Reply to Conversation",
  description: "Reply to a conversation specified by ID. [See the documentation](https://developers.belco.io/reference/put_conversations-conversationid-reply)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    belco,
    conversationId: {
      propDefinition: [
        belco,
        "conversationId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The reply message body",
    },
  },
  async run({ $ }) {
    const response = await this.belco.replyToConversation({
      $,
      conversationId: this.conversationId,
      data: {
        body: this.body,
      },
    });

    $.export("$summary", `Replied to conversation successfully: ${this.conversationId}`);
    return response;
  },
};
