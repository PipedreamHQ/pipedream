import renderio from "../../renderio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import {
  parseObject,
  parseRequiredObject,
  validateKeys,
} from "../../common/utils.mjs";

export default {
  key: "renderio-download-video-with-ytdlp",
  name: "Download Video with yt-dlp",
  description: "Download publicly accessible videos from yt-dlp-supported platforms like YouTube, TikTok, Instagram, Vimeo, and Twitch without additional processing. Provide input URLs as a dictionary with `in_` prefixed keys, for example `{ \"in_video\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\" }`. For download plus FFmpeg processing, use **Download and Process Video with yt-dlp** instead. [See the documentation](https://renderio.dev/docs/api-reference/commands/ytdlp-download)",
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

    if (metadata) data.metadata = metadata;

    const response = await this.renderio.downloadVideoWithYtdlp({
      $,
      data,
    });
    $.export("$summary", `Successfully submitted yt-dlp download${response.command_id
      ? ` ${response.command_id}`
      : ""}`);
    return response;
  },
};
