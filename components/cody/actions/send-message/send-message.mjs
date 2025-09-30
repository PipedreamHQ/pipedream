import cody from "../../cody.app.mjs";

export default {
  key: "cody-send-message",
  name: "Send Message",
  description: "Send your message and receive the AI-generated response. [See the documentation](https://developers.meetcody.ai/operation/operation-send-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cody,
    botId: {
      propDefinition: [
        cody,
        "botId",
      ],
    },
    conversationId: {
      propDefinition: [
        cody,
        "conversationId",
        ({ botId }) => ({
          botId,
        }),
      ],
    },
    content: {
      propDefinition: [
        cody,
        "contentMessage",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cody.sendMessage({
      $,
      data: {
        conversation_id: this.conversationId,
        content: this.content,
      },
    });

    $.export("$summary", `Sent message successfully with ID ${response.data?.id}`);
    return response;
  },
};
