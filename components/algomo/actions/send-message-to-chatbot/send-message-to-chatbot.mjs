import app from "../../algomo.app.mjs";

export default {
  key: "algomo-send-message-to-chatbot",
  name: "Send Message To Chatbot",
  description: "Send a message to a specific Algomo chatbot and get the response. [See the documentation](https://help.algomo.com/docs/api-access/using%20our%20apis#api-call-for-bot-response-generation)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    botId: {
      propDefinition: [
        app,
        "botId",
      ],
    },
    messageText: {
      propDefinition: [
        app,
        "messageText",
      ],
    },
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
      ],
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
      botId,
      messageText,
      conversationId,
    } = this;

    return sendMessageToChatbot({
      step,
      data: {
        botId,
        messageText,
        conversationId,
      },
      summary: (response) => `Successfully sent message to chatbot with conversation ID \`${response.metadata.conversationId}\``,
    });
  },
};
