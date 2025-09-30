import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-upload-channel-banner",
  name: "Upload Channel Banner",
  description: "Uploads a channel banner image to YouTube. [See the documentation](https://developers.google.com/youtube/v3/docs/channelBanners/insert) for more information",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    youtubeDataApi,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content: "- Maximum file size: 6MB \n- The image must have a 16:9 aspect ratio and be at least 2048x1152 pixels \n- Accepted Media MIME types: image/jpeg, image/png, application/octet-stream",
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
