import buildchatbot from "../../buildchatbot.app.mjs";

export default {
  key: "buildchatbot-attach-single-content-to-bot",
  name: "Attach Single Content to Bot",
  description: "Attach a single content to a bot. [See the API documentation](https://documenter.getpostman.com/view/27680478/2s9YR6baAb#193b3c3e-d544-461e-b057-99df27a0f5d4)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    buildchatbot,
    chatbotId: {
      propDefinition: [
        buildchatbot,
        "chatbotId",
      ],
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to attach to the bot",
    },
  },
  async run({ $ }) {
    const response = await this.buildchatbot.attachSingleContentToBot({
      $,
      chatbotId: this.chatbotId,
      data: {
        text: this.text,
      },
    });

    $.export("$summary", `Successfully attached text to bot ${this.chatbotId}`);

    return response;
  },
};
