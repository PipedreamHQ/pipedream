import bot9 from "../../bot9.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bot9-send-chat-message",
  name: "Send Chat Message",
  description: "Send a chat message to a Bot9 chatbot. [See the documentation](https://bot9ai.apimatic.dev/v/1_0)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bot9,
    chatbotId: {
      propDefinition: [
        bot9,
        "chatbotId",
      ],
    },
    conversationId: {
      propDefinition: [
        bot9,
        "conversationId",
      ],
    },
    message: {
      propDefinition: [
        bot9,
        "message",
      ],
    },
    // The following props are not used in the action and are not required by the API for this specific action.
    // They should be removed to avoid confusion unless the instructions explicitly say to include them.
  },
  async run({ $ }) {
    const response = await this.bot9.sendMessage({
      chatbotId: this.chatbotId,
      conversationId: this.conversationId,
      message: this.message,
    });

    $.export("$summary", `Sent message to conversation ID ${this.conversationId}`);
    return response;
  },
};
