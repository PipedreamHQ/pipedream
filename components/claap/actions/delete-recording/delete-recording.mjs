import claap from "../../claap.app.mjs";

export default {
  key: "claap-delete-recording",
  name: "Delete Recording",
  description: "Delete a recording in Claap. [See the documentation](https://docs.claap.io/api-reference/endpoint/delete_recording).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.claap.deleteRecording({
      $,
      recordingId: this.recordingId,
    });
    $.export("$summary", `Successfully deleted recording \`${this.recordingId}\`.`);
    return response;
  },
};
