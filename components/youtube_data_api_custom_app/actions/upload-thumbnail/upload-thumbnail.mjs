import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/upload-thumbnail/common.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-upload-thumbnail",
  name: "Upload Thumbnail",
  description: "Uploads a custom video thumbnail to YouTube and sets it for a video. [See the docs](https://developers.google.com/youtube/v3/docs/thumbnails/set) for more information",
  version: "0.0.3",
  type: "action",
  props: {
    youtubeDataApi,
    videoId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedVideo",
      ],
    },
    fileUrl: {
      propDefinition: [
        youtubeDataApi,
        "fileUrl",
      ],
      description: "The URL of the thumbnail image file you want to upload to YouTube. Must specify either **File URL** or **File Path**.",
    },
    filePath: {
      propDefinition: [
        youtubeDataApi,
        "filePath",
      ],
      description: "Path to the thumbnail image file to upload (e.g., `/tmp/myVideo.mp4`). Must specify either **File URL** or **File Path**.",
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
