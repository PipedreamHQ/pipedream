import app from "../../chat_data.app.mjs";

export default {
  key: "chat_data-create-chatbot",
  name: "Create Chatbot",
  description: "Create a chatbot with the specified properties. [See the documentation](https://www.chat-data.com/api-reference#tag/Chatbot-Operations/operation/chatbotCreate)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    chatbotName: {
      propDefinition: [
        app,
        "chatbotName",
      ],
    },
    sourceText: {
      propDefinition: [
        app,
        "sourceText",
      ],
    },
    urlsToScrape: {
      propDefinition: [
        app,
        "urlsToScrape",
      ],
    },
    customBackend: {
      propDefinition: [
        app,
        "customBackend",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createChatbot({
      $,
      data: {
        chatbotName: this.chatbotName,
        sourceText: this.sourceText,
        urlsToScrape: this.urlsToScrape,
        customBackend: this.customBackend,
        model: this.model,
      },
    });
    $.export("$summary", `Successfully created Chatbot with ID '${response.chatbotId}'`);
    return response;
  },
};
