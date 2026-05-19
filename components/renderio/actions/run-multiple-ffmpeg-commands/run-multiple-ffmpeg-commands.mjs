import renderio from "../../renderio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  parseArray,
  validateKeys,
} from "../../common/utils.mjs";

export default {
  key: "renderio-run-multiple-ffmpeg-commands",
  name: "Run Multiple FFmpeg Commands",
  description: "Execute multiple independent FFmpeg commands in one request. [See the documentation](https://renderio.dev/docs)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    commands: {
      type: "string",
      label: "Commands JSON Array",
      description: "JSON array of command objects. Each object should include `input_files`, `output_files`, and `ffmpeg_command`. Example: `[{\"input_files\":{\"in_video\":\"https://example.com/video.mp4\"},\"output_files\":{\"out_video\":\"output.mp4\"},\"ffmpeg_command\":\"-i {{in_video}} {{out_video}}\"}]`.",
    },
  },
  async run({ $ }) {
    const commands = parseArray(this.commands, "Commands JSON Array");
    if (commands.length === 0) {
      throw new ConfigurationError("Commands JSON Array must be a non-empty array");
    }

    for (const command of commands) {
      validateKeys(command.input_files || {}, "in_", "Input file");
      validateKeys(command.output_files || {}, "out_", "Output file");
    }

    const response = await this.renderio.runMultipleFfmpegCommands({
      $,
      data: {
        commands,
      },
    });
    $.export("$summary", `Successfully submitted ${commands.length} FFmpeg command${commands.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
