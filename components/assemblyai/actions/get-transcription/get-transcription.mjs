import assemblyai from "../../assemblyai.app.mjs";

export default {
  name: "Get Transcription",
  description: "Fetches a specific transcribed result from the AssemblyAI API. [See the documentation](https://www.assemblyai.com/docs/api-reference/transcripts/get)",
  key: "assemblyai-get-transcription",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    assemblyai,
    transcriptId: {
      propDefinition: [
        assemblyai,
        "transcriptId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.assemblyai.getTranscript({
      transcriptId: this.transcriptId,
      $,
    });

    $.export("$summary", `Successfully retrieved transcription for transcript with ID ${this.transcriptId}.`);

    return response;
  },
};
