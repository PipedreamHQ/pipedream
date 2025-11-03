import rendi from "../../rendi.app.mjs";

export default {
  key: "rendi-get-ffmpeg-command-status",
  name: "Get FFmpeg Command Status",
  description: "Get the status of a previously submitted FFmpeg command. [See the documentation](https://docs.rendi.dev/api-reference/endpoint/poll-command)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rendi,
    commandId: {
      type: "string",
      label: "Command ID",
      description: "ID of the FFmpeg command to check",
    },
  },
  async run({ $ }) {
    const response = await this.rendi.getFfmpegCommand({
      $,
      commandId: this.commandId,
    });
    $.export("$summary", `Successfully retrieved status of FFmpeg command with ID: ${this.commandId}`);
    return response;
  },
};
