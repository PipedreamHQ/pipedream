import assemblyai from "../../assemblyai.app.mjs";

export default {
  name: "Create Captions",
  description: "Export your completed transcripts in SRT (srt) or VTT (vtt) format, which can be used for subtitles and closed captions in videos. [See the documentation](https://www.assemblyai.com/docs/API%20reference/transcript)",
  key: "assemblyai-create-captions",
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
    subtitleFormat: {
      propDefinition: [
        assemblyai,
        "subtitleFormat",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.assemblyai.createCaptions({
      transcriptId: this.transcriptId,
      format: this.subtitleFormat,
      $,
    });

    $.export("$summary", `Successfully created captions for transcript with id ${this.transcriptId}.`);

    return response;
  },
};
