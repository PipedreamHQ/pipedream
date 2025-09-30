import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/upload-channel-banner/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-upload-channel-banner",
  name: "Upload Channel Banner",
  description: "Uploads a channel banner image to YouTube. [See the docs](https://developers.google.com/youtube/v3/docs/channelBanners/insert) for more information",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    youtubeDataApi,
    fileUrl: {
      propDefinition: [
        youtubeDataApi,
        "fileUrl",
      ],
      description: "The URL of the banner image file you want to upload to YouTube. Must specify either **File URL** or **File Path**.",
    },
    filePath: {
      propDefinition: [
        youtubeDataApi,
        "filePath",
      ],
      description: "Path to the banner image file to upload (e.g., `/tmp/myVideo.mp4`). Must specify either **File URL** or **File Path**.",
    },
    onBehalfOfContentOwner: {
      propDefinition: [
        youtubeDataApi,
        "onBehalfOfContentOwner",
      ],
    },
    ...common.props,
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
};
