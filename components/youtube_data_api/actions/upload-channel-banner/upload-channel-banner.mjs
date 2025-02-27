import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-upload-channel-banner",
  name: "Upload Channel Banner",
  description: "Uploads a channel banner image to YouTube. [See the documentation](https://developers.google.com/youtube/v3/docs/channelBanners/insert) for more information",
  version: "0.0.4",
  type: "action",
  props: {
    youtubeDataApi,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "- Maximum file size: 6MB \n- The image must have a 16:9 aspect ratio and be at least 2048x1152 pixels \n- Accepted Media MIME types: image/jpeg, image/png, application/octet-stream",
    },
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
  },
};
