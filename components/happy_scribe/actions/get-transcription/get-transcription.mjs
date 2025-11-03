import app from "../../happy_scribe.app.mjs";

export default {
  name: "Get Transcription",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "happy_scribe-get-transcription",
  description: "Retrieve a transcription. [See the documentation](https://dev.happyscribe.com/sections/product/#transcriptions-list-all-transcriptions)",
  type: "action",
  props: {
    app,
    transcriptionId: {
      propDefinition: [
        app,
        "transcriptionId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTranscription({
      $,
      transcriptionId: this.transcriptionId,
    });

    if (response.id) {
      $.export("$summary", `Successfully retrieved transcription with ID ${response.id}`);
    }

    return response;
  },
};
