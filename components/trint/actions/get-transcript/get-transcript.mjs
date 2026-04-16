import trint from "../../trint.app.mjs";
import downloadFormats from "../../common/download-formats.mjs";

export default {
  key: "trint-get-transcript",
  name: "Get Transcript",
  description: "Retrieve the full transcription of a processed media file. [See the documentation](https://dev.trint.com/reference/get-file)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trint,
    transcriptId: {
      propDefinition: [
        trint,
        "transcriptId",
      ],
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format to export the transcript in. Will return JSON, HTML, or a URL to the transcript in the selected format.",
      options: downloadFormats,
    },
  },
  async run({ $ }) {
    const response = await this.trint.getTranscript({
      $,
      format: this.format,
      transcriptId: this.transcriptId,
    });
    $.export("$summary", `Successfully retrieved transcript for transcript ID: ${this.transcriptId}`);
    return response;
  },
};
