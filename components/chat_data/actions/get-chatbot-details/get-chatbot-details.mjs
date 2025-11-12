import app from "../../chat_data.app.mjs";

export default {
  key: "chat_data-get-chatbot-details",

  name: "Get Chatbot Status",
  description: "Get status of the Chatbot with the specified ID. [See the documentation](https://www.chat-data.com/api-reference#tag/Chatbot-Operations/operation/GetChatbotStatus)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    chatbotId: {
      propDefinition: [
        app,
        "chatbotId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.getChatbotStatus({
      $,
      chatbotId: this.chatbotId,
    });

    $.export("$summary", `Successfully retrieved status of the Chatbot with ID '${this.chatbotId}'`);

    return response;
  },
};
