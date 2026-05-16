import renderio from "../../renderio.app.mjs";
import {
  parseObject,
  parseRequiredObject,
  validateKeys,
} from "../../common/utils.mjs";

export default {
  key: "renderio-run-chained-ffmpeg-commands",
  name: "Run Chained FFmpeg Commands",
  description: "Execute multiple chained FFmpeg commands sequentially with shared input and output file specifications. [See the documentation](https://renderio.dev/docs)",
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
      type: "object",
      label: "Input File URLs",
      description: "Dictionary mapping input aliases to publicly accessible file URLs. Keys must start with `in_`.",
    },
    outputFiles: {
      type: "object",
      label: "Output File Names",
      description: "Dictionary mapping output aliases to desired output file names. Keys must start with `out_`.",
    },
    ffmpegCommands: {
      type: "string[]",
      label: "FFmpeg Commands",
      description: "Ordered FFmpeg commands to execute sequentially. Use placeholders matching the input and output file keys.",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Optional key-value metadata to attach to the command.",
      optional: true,
    },
  },
  async run({ $ }) {
    const inputFiles = parseRequiredObject(this.inputFiles, "Input File URLs");
    const outputFiles = parseRequiredObject(this.outputFiles, "Output File Names");
    const metadata = parseObject(this.metadata, "Metadata");

    validateKeys(inputFiles, "in_", "Input file");
    validateKeys(outputFiles, "out_", "Output file");

    const data = {
      input_files: inputFiles,
      output_files: outputFiles,
      ffmpeg_commands: this.ffmpegCommands,
    };

    if (metadata) data.metadata = metadata;

    const response = await this.renderio.runChainedFfmpegCommands({
      $,
      data,
    });
    $.export("$summary", `Successfully submitted ${this.ffmpegCommands.length} chained FFmpeg command${this.ffmpegCommands.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
