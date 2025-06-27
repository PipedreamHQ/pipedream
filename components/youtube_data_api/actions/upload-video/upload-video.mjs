import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-upload-video",
  name: "Upload Video",
  description: "Post a video to your channel. [See the documentation](https://developers.google.com/youtube/v3/docs/videos/insert) for more information",
  version: "1.0.0",
  type: "action",
  props: {
    youtubeDataApi,
    title: {
      propDefinition: [
        youtubeDataApi,
        "title",
      ],
    },
    description: {
      propDefinition: [
        youtubeDataApi,
        "description",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
    },
    privacyStatus: {
      propDefinition: [
        youtubeDataApi,
        "privacyStatus",
      ],
    },
    publishAt: {
      propDefinition: [
        youtubeDataApi,
        "publishAt",
      ],
    },
    tags: {
      propDefinition: [
        youtubeDataApi,
        "tags",
      ],
    },
    notifySubscribers: {
      propDefinition: [
        youtubeDataApi,
        "notifySubscribers",
      ],
    },
    ...common.props,
  },
};
