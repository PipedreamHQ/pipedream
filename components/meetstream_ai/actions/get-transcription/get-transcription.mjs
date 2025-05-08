import meetstream_ai from "../../meetstream_ai.app.mjs";

export default {
  key: "meetstream_ai-get-transcription",
  name: "Get Transcription",
  description: "Retrieves the transcript file for a specific bot, if available. [See the documentation](https://vento.so/view/35d0142d-f91f-47f6-8175-d42e1953d6f1?utm_medium=share)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    meetstream_ai,
    botId: {
      propDefinition: [
        meetstream_ai,
        "botId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.meetstream_ai.getTranscript({
      botId: this.botId,
    });
    $.export("$summary", `Successfully retrieved transcription for bot ID: ${this.botId}`);
    return response;
  },
};
