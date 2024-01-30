import stammerAi from "../../stammerai.app.mjs";

export default {
  key: "stammer_ai-message-chatbot",
  name: "Message Chatbot",
  description: "Sends a message to your chatbot. [See the documentation](https://app.stammer.ai/en/api-docs/chatbot/message/)",
  version: "0.0.1",
  type: "action",
  props: {
    stammerAi,
    message: {
      propDefinition: [
        stammerAi,
        "message",
      ],
    },
    apiToken: {
      propDefinition: [
        stammerAi,
        "apiToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stammerAi.sendMessage({
      $,
    });
    $.export("$summary", "Message sent to chatbot successfully");
    return response;
  },
};
