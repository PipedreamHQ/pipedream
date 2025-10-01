import meetstreamAi from "../../meetstream_ai.app.mjs";

export default {
  key: "meetstream_ai-remove-bot",
  name: "Remove Bot",
  description: "Removes a bot from its meeting and deletes its associated data. [See the documentation](https://vento.so/view/35d0142d-f91f-47f6-8175-d42e1953d6f1?utm_medium=share)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    meetstreamAi,
    botId: {
      propDefinition: [
        meetstreamAi,
        "botId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.meetstreamAi.removeBotInstance({
      $,
      botId: this.botId,
    });

    $.export("$summary", `Successfully removed bot with ID ${this.botId}`);
    return response;
  },
};
