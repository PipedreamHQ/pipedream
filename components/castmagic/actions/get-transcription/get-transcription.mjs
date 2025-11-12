import castmagic from "../../castmagic.app.mjs";

export default {
  key: "castmagic-get-transcription",
  name: "Get Transcription",
  description: "Retrieves details for a transcript given an identifier. [See the documentation](https://docs.castmagic.io/endpoints/transcripts)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    castmagic,
    transcriptionId: {
      type: "string",
      label: "Transcription ID",
      description: "ID of the transcript to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.castmagic.getTranscription({
      $,
      transcriptionId: this.transcriptionId,
    });
    $.export("$summary", `Successfully retrieved transcription with ID ${response.id}`);
    return response;
  },
};
