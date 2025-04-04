import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-upload-thumbnail",
  name: "Upload Thumbnail",
  description: "Uploads a custom video thumbnail to YouTube and sets it for a video. Note: Account must be [verified](https://www.youtube.com/verify). [See the documentation](https://developers.google.com/youtube/v3/docs/thumbnails/set) for more information",
  version: "0.0.3",
  type: "action",
  props: {
    youtubeDataApi,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "- Maximum file size: 2MB \n- Accepted Media MIME types: image/jpeg, image/png, application/octet-stream",
    },
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
  },
};
