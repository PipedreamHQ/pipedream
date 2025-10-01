import maintainx from "../../maintainx.app.mjs";

export default {
  name: "Send Message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "maintainx-send-message",
  description: "Send message to a conversation. [See docs here](https://api.getmaintainx.com/v1/docs#tag/Conversations/paths/~1conversations~1{id}~1messages/post)",
  type: "action",
  props: {
    maintainx,
    conversationId: {
      propDefinition: [
        maintainx,
        "conversationId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The message content",
    },
  },
  async run({ $ }) {
    const response = await this.maintainx.sendMessage({
      $,
      conversationId: this.conversationId,
      data: {
        content: this.content,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent message to conversation ID ${response.id}`);
    }

    return response;
  },
};
