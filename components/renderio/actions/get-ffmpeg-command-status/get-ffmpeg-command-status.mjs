import renderio from "../../renderio.app.mjs";

export default {
  key: "renderio-get-ffmpeg-command-status",
  name: "Get FFmpeg Command Status",
  description: "Get the status and results of a previously submitted FFmpeg command. [See the documentation](https://renderio.dev/docs/api-reference/commands/get-command)",
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
      description: "The unique identifier of the FFmpeg command to retrieve, for example `cmd_01HZX3Y7K9M4P2Q8R5T1V6W3`. Use the command ID returned by **Run FFmpeg Command**, **Run Chained FFmpeg Commands**, or **Run Multiple FFmpeg Commands**.",
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
