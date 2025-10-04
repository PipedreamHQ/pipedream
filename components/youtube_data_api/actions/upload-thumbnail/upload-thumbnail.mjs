import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-upload-thumbnail",
  name: "Upload Thumbnail",
  description: "Uploads a custom video thumbnail to YouTube and sets it for a video. Note: Account must be [verified](https://www.youtube.com/verify). [See the documentation](https://developers.google.com/youtube/v3/docs/thumbnails/set) for more information",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
