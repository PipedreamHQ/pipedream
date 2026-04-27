import claap from "../../claap.app.mjs";

export default {
  key: "claap-get-recording-transcript",
  name: "Get Recording Transcript",
  description: "Get the transcript for a specific recording in Claap. [See the documentation](https://docs.claap.io/api-reference/endpoint/get_recording_transcript).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    claap,
    recordingId: {
      propDefinition: [
        claap,
        "recordingId",
      ],
    },
    lang: {
      type: "string",
      label: "Language",
      description: "2-letter language code for translation",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "Transcript format (default: `json`)",
      optional: true,
      options: [
        "json",
        "text",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.claap.getRecordingTranscript({
      $,
      recordingId: this.recordingId,
      params: {
        lang: this.lang,
        format: this.format,
      },
    });
    $.export("$summary", `Successfully retrieved transcript for recording \`${this.recordingId}\`.`);
    return response;
  },
};
