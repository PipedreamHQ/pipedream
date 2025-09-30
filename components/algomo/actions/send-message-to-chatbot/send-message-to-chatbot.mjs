import app from "../../algomo.app.mjs";

export default {
  key: "algomo-send-message-to-chatbot",
  name: "Send Message To Chatbot",
  description: "Send a message to a specific Algomo chatbot and get the response. [See the documentation](https://help.algomo.com/docs/api-access/using%20our%20apis#api-call-for-bot-response-generation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The message that you wish to generate a response for",
    },
    conversationId: {
      type: "string",
      label: "Conversation ID",
      description: "A user-defined identifier for threading conversations. This allows the bot to refer to previous messages when responding, providing more contextually relevant answers. If conversationId isn't provided, one will be generated for you",
      optional: true,
    },
  },
  methods: {
    sendMessageToChatbot(args = {}) {
      return this.app.post({
        path: "/get-bot-response",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      sendMessageToChatbot,
      messageText,
      conversationId,
    } = this;

    return sendMessageToChatbot({
      step,
      data: {
        messageText,
        conversationId,
      },
      summary: (response) => `Successfully sent message to chatbot with conversation ID \`${response.metadata.conversationId}\``,
    });
  },
};
