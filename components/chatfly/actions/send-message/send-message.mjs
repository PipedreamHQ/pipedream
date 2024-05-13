import chatfly from "../../chatfly.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatfly-send-message",
  name: "Send Message",
  description: "Dispatches a text message to a specified group or individual in Chatfly.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatfly,
    botId: {
      propDefinition: [
        chatfly,
        "botId",
      ],
    },
    message: {
      propDefinition: [
        chatfly,
        "message",
      ],
    },
    sessionId: {
      propDefinition: [
        chatfly,
        "sessionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatfly.dispatchMessage({
      botId: this.botId,
      message: this.message,
      sessionId: this.sessionId,
    });
    $.export("$summary", "Message dispatched successfully");
    return response;
  },
};
