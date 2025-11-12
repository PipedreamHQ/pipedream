import chatfly from "../../chatfly.app.mjs";

export default {
  key: "chatfly-send-message",
  name: "Send Message",
  description: "Dispatches a text message to a specified group or individual in Chatfly.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    chatfly,
    botId: {
      propDefinition: [
        chatfly,
        "botId",
      ],
    },
    sessionId: {
      propDefinition: [
        chatfly,
        "sessionId",
        ({ botId }) => ({
          botId,
        }),
      ],
    },
    message: {
      propDefinition: [
        chatfly,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatfly.dispatchMessage({
      $,
      data: {
        bot_id: this.botId,
        message: this.message,
        session_id: this.sessionId,
      },
    });
    $.export("$summary", "Message dispatched successfully");
    return response;
  },
};
