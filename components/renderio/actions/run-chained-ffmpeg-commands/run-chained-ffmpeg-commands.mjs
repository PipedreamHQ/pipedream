import renderio from "../../renderio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  parseObject,
  parseRequiredObject,
  validateKeys,
} from "../../common/utils.mjs";

export default {
  key: "renderio-run-chained-ffmpeg-commands",
  name: "Run Chained FFmpeg Commands",
  description: "Execute multiple chained FFmpeg commands sequentially with shared input and output file specifications. [See the documentation](https://renderio.dev/docs/api-reference/commands/run-chained-commands)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    inputFiles: {
      propDefinition: [
        renderio,
        "inputFiles",
      ],
    },
    outputFiles: {
      propDefinition: [
        renderio,
        "outputFiles",
      ],
    },
    ffmpegCommands: {
      type: "string[]",
      label: "FFmpeg Commands",
      description: "Ordered FFmpeg commands to execute sequentially. Use `{{alias}}` placeholders matching input keys such as `in_video` and output keys such as `out_final`. Example: `[\"-i {{in_video}} -vf scale=1280:720 {{out_scaled}}\", \"-i {{out_scaled}} -c:v libx264 {{out_final}}\"]`.",
    },
    metadata: {
      propDefinition: [
        renderio,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const inputFiles = parseRequiredObject(this.inputFiles, "Input File URLs");
    const outputFiles = parseRequiredObject(this.outputFiles, "Output File Names");
    const metadata = parseObject(this.metadata, "Metadata");
    const ffmpegCommands = this.ffmpegCommands;

    if (!Array.isArray(ffmpegCommands) || ffmpegCommands.length === 0) {
      throw new ConfigurationError("FFmpeg Commands must be a non-empty array");
    }
    if (ffmpegCommands.some((command) => typeof command !== "string" || !command.trim())) {
      throw new ConfigurationError("Each FFmpeg command must be a non-empty string");
    }

    validateKeys(inputFiles, "in_", "Input file");
    validateKeys(outputFiles, "out_", "Output file");

    const data = {
      input_files: inputFiles,
      output_files: outputFiles,
      ffmpeg_commands: ffmpegCommands,
    };

    if (metadata) data.metadata = metadata;

    const response = await this.renderio.runChainedFfmpegCommands({
      $,
      data,
    });
    $.export("$summary", `Successfully submitted ${ffmpegCommands.length} chained FFmpeg command${ffmpegCommands.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
