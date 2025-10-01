import app from "../../happy_scribe.app.mjs";

export default {
  name: "Delete Transcription",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "happy_scribe-delete-transcription",
  description: "Delete a transcription. [See the documentation](https://dev.happyscribe.com/sections/product/#transcriptions-delete-a-transcription)",
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
    const response = await this.app.deleteTranscription({
      $,
      transcriptionId: this.transcriptionId,
    });

    $.export("$summary", `Successfully deleted transcription with ID ${this.transcriptionId}`);

    return response;
  },
};
