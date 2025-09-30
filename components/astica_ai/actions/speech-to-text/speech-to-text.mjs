import asticaAi from "../../astica_ai.app.mjs";

export default {
  name: "Speech To Text",
  description: "Transcribe an audio file to text with Astica AI [See the documentation](https://astica.ai/hearing/documentation/)",
  key: "astica_ai-speech-to-text",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    asticaAi,
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL of the audio file to transcribe",
    },
  },
  async run({ $ }) {
    const response = await this.asticaAi.speechToText({
      data: {
        input: this.fileUrl,
        modelVersion: "1.0_full",
        doStream: 0,
        low_priority: 0,
      },
      $,
    });

    if (response?.status === "success") {
      $.export("$summary", "Successfully transcribed audio.");
    }

    return response;
  },
};
