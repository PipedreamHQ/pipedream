import stammerAi from "../../stammerai.app.mjs";

export default {
  key: "stammer_ai-message-chatbot",
  name: "Message Chatbot",
  description: "Sends a message to your chatbot and gets an immediate response. This action is popular for automating answers to common questions.",
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
      message: this.message,
    });
    $.export("$summary", "Message sent to chatbot successfully");
    return response;
  },
};
