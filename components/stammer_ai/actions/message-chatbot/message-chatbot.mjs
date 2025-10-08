import stammerAi from "../../stammer_ai.app.mjs";

export default {
  key: "stammer_ai-message-chatbot",
  name: "Message Chatbot",
  description: "Sends a message to your chatbot. [See the documentation](https://app.stammer.ai/en/api-docs/chatbot/message/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    stammerAi,
    chatbotUuid: {
      propDefinition: [
        stammerAi,
        "chatbotUuid",
      ],
    },
    query: {
      propDefinition: [
        stammerAi,
        "query",
      ],
    },
    userKey: {
      propDefinition: [
        stammerAi,
        "userKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stammerAi.sendMessage({
      $,
      data: {
        chatbot_uuid: this.chatbotUuid,
        query: this.query,
        user_key: this.userKey,
      },
    });
    $.export("$summary", "Message sent to chatbot successfully");
    return response;
  },
};
