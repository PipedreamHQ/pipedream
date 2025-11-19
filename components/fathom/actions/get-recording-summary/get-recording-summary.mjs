import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-get-recording-summary",
  name: "Get Recording Summary",
  description: "Get the summary of a recording. [See the documentation](https://developers.fathom.ai/api-reference/recordings/get-summary)",
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
    const response = await this.fathom.getRecordingSummary({
      $,
      recordingId: this.recordingId,
    });
    $.export("$summary", `Successfully fetched recording summary for recording ID: ${this.recordingId}`);
    return response;
  },
};
