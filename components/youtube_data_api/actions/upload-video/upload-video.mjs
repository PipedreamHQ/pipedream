import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-upload-video",
  name: "Upload Video",
  description: "Post a video to your channel. [See the docs](https://developers.google.com/youtube/v3/docs/videos/insert) for more information",
  version: "0.0.3",
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
    fileUrl: {
      propDefinition: [
        youtubeDataApi,
        "fileUrl",
      ],
    },
    filePath: {
      propDefinition: [
        youtubeDataApi,
        "filePath",
      ],
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
