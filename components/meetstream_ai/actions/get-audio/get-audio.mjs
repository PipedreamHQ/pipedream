import meetstreamAi from "../../meetstream_ai.app.mjs";

export default {
  key: "meetstream_ai-get-audio",
  name: "Get Recorded Audio",
  description: "Retrieves the recorded audio file for a specific bot, if available. [See the documentation](https://vento.so/view/35d0142d-f91f-47f6-8175-d42e1953d6f1?utm_medium=share)",
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
    const response = await this.meetstreamAi.getRecordedAudio({
      $,
      botId: this.botId,
    });

    $.export("$summary", `Successfully retrieved recorded audio for bot ID ${this.botId}`);
    return response;
  },
};
