import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-get-recording-transcript",
  name: "Get Recording Transcript",
  description: "Get the transcript of a recording. [See the documentation](https://developers.fathom.ai/api-reference/recordings/get-transcript)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fathom,
    recordingId: {
      propDefinition: [
        fathom,
        "recordingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fathom.getRecordingTranscript({
      $,
      recordingId: this.recordingId,
    });
    $.export("$summary", `Successfully fetched recording transcript for recording ID: ${this.recordingId}`);
    return response;
  },
};
