import assemblyai from "../../assemblyai.app.mjs";

export default {
  name: "Get Transcription",
  description: "Fetches a specific transcribed result from the AssemblyAI API. [See the documentation](https://www.assemblyai.com/docs/API%20reference/transcript)",
  key: "assemblyai-get-transcription",
  version: "0.0.1",
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

    $.export("$summary", `Successfully retrieved transcript with id ${this.transcriptId}.`);

    return response;
  },
};
