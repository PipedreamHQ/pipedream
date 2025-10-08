import meetstreamAi from "../../meetstream_ai.app.mjs";

export default {
  key: "meetstream_ai-get-bot-status",
  name: "Get Bot Status",
  description: "Retrieves the current status of a specific bot. [See the documentation](https://vento.so/view/35d0142d-f91f-47f6-8175-d42e1953d6f1?utm_medium=share)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const response = await this.meetstreamAi.getBotStatus({
      $,
      botId: this.botId,
    });
    $.export("$summary", `Successfully retrieved status for Bot ID ${this.botId}`);
    return response;
  },
};
