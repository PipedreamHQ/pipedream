import app from "../../chat_data.app.mjs";

export default {
  key: "chat_data-delete-chatbot",
  name: "Delete Chatbot",
  description: "Delete a chatbot with the specified ID. [See the documentation](https://www.chat-data.com/api-reference#tag/Chatbot-Operations/operation/chatbotDelete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.deleteChatbot({
      $,
      chatbotId: this.chatbotId,
    });

    $.export("$summary", `Successfully deleted Chatbot with ID '${this.chatbotId}'`);

    return response;
  },
};
