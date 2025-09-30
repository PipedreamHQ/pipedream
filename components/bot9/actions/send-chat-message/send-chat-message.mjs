import app from "../../bot9.app.mjs";

export default {
  key: "bot9-send-chat-message",
  name: "Send Chat Message",
  description: "Send a chat message to a Bot9 chatbot. [See the documentation](https://bot9ai.apimatic.dev/v/1_0#/rest/introduction/introduction/getting-started-with-bot9/end-user-chat-api/chat-endpoint)",
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
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
  },
  methods: {
    sendMessage({
      chatbotId, conversationId, ...args
    }) {
      return this.app.post({
        path: `/${chatbotId}/conversations/${conversationId}/chat`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendMessage,
      chatbotId,
      conversationId,
      message,
    } = this;

    const response = await sendMessage({
      $,
      chatbotId,
      conversationId,
      data: {
        message,
      },
    });

    $.export("$summary", `Sent message with code \`${response.code}\``);
    return response;
  },
};
