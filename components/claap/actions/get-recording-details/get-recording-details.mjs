import claap from "../../claap.app.mjs";

export default {
  key: "claap-get-recording-details",
  name: "Get Recording Details",
  description: "Get the details for a specific recording in Claap. [See the documentation](https://docs.claap.io/api-reference/endpoint/get_recording).",
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
  },
  async run({ $ }) {
    const response = await this.claap.getRecording({
      $,
      recordingId: this.recordingId,
    });
    $.export("$summary", `Successfully retrieved details for recording \`${this.recordingId}\`.`);
    return response;
  },
};
