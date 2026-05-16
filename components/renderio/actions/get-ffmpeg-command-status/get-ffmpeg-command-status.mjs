import renderio from "../../renderio.app.mjs";

export default {
  key: "renderio-get-ffmpeg-command-status",
  name: "Get FFmpeg Command Status",
  description: "Get the status and results of a previously submitted FFmpeg command. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    renderio,
    commandId: {
      type: "string",
      label: "Command ID",
      description: "The unique identifier of the FFmpeg command to retrieve.",
    },
  },
  async run({ $ }) {
    const response = await this.renderio.getFfmpegCommand({
      $,
      commandId: this.commandId,
    });
    $.export("$summary", `Successfully retrieved FFmpeg command ${this.commandId}`);
    return response;
  },
};
