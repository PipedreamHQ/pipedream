import renderio from "../../renderio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  parseObject,
  parseRequiredObject,
  validateKeys,
} from "../../common/utils.mjs";

export default {
  key: "renderio-download-and-process-video-with-ytdlp",
  name: "Download and Process Video with yt-dlp",
  description: "Download publicly accessible videos with yt-dlp and optionally process them with FFmpeg. Use this to fetch videos from supported platforms and transform them, for example extract audio, resize, trim, or convert formats. Provide input URLs as a dictionary with `in_` prefixed keys; when processing with FFmpeg, provide output aliases with `out_` prefixes. [See the documentation](https://renderio.dev/docs/api-reference/commands/run-ytdlp-command)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    renderio,
    inputUrls: {
      propDefinition: [
        renderio,
        "inputUrls",
      ],
    },
    ffmpegCommand: {
      type: "string",
      label: "FFmpeg Command",
      description: "Optional FFmpeg command to run after downloading. Use `{{alias}}` placeholders matching input URL keys and output file keys. Example: `-i {{in_video}} -vn -acodec libmp3lame -ab 192k {{out_audio}}`.",
      optional: true,
    },
    outputFiles: {
      propDefinition: [
        renderio,
        "outputFiles",
      ],
      description: "Dictionary mapping output aliases to desired output file names. Required when FFmpeg Command is set. Keys must start with `out_`. Example: `{ \"out_audio\": \"audio.mp3\" }`.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        renderio,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const inputUrls = parseRequiredObject(this.inputUrls, "Input Video URLs");
    const metadata = parseObject(this.metadata, "Metadata");

    if (Object.keys(inputUrls).length === 0) {
      throw new ConfigurationError("Input Video URLs must include at least one URL");
    }
    validateKeys(inputUrls, "in_", "Input URL");

    const data = {
      input_urls: inputUrls,
    };

    if (this.ffmpegCommand) {
      const outputFiles = parseRequiredObject(this.outputFiles, "Output File Names");
      if (Object.keys(outputFiles).length === 0) {
        throw new ConfigurationError("Output File Names must include at least one output when FFmpeg Command is set");
      }

      validateKeys(outputFiles, "out_", "Output file");
      data.ffmpeg_command = this.ffmpegCommand;
      data.output_files = outputFiles;
    }
    if (metadata) data.metadata = metadata;

    const response = await this.renderio.downloadAndProcessVideoWithYtdlp({
      $,
      data,
    });
    $.export("$summary", `Successfully submitted yt-dlp command${response.command_id
      ? ` ${response.command_id}`
      : ""}`);
    return response;
  },
};
