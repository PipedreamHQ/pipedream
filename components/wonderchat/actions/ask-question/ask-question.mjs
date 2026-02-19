import wonderchat from "../../wonderchat.app.mjs";

export default {
  key: "wonderchat-ask-question",
  name: "Ask Question",
  description: "Ask a question to a WonderChat chatbot and receive a response. [See the documentation](https://docs.wonderchat.io/api-reference/chat)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    wonderchat,
    chatbotId: {
      type: "string",
      label: "Chatbot ID",
      description: "The ID of the chatbot you want to chat with. Can be found in the URL or share link of the chatbot.",
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question you wish to ask your chatbot",
    },
    chatlogId: {
      type: "string",
      label: "Chatlog ID",
      description: "The ID of your current chat session for conversation continuity. Found under the Chatlog Details in the WonderChat UI.",
      optional: true,
    },
    context: {
      type: "string",
      label: "Context",
      description: "Additional custom context about the chat session (e.g., user information)",
      optional: true,
    },
    contextUrl: {
      type: "string",
      label: "Context URL",
      description: "URL of the page the user is on to provide additional context",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.wonderchat.chat({
      $,
      data: {
        chatbotId: this.chatbotId,
        question: this.question,
        chatlogId: this.chatlogId,
        context: this.context,
        contextUrl: this.contextUrl,
      },
    });
    $.export("$summary", "Successfully asked question to chatbot");
    return response;
  },
};
