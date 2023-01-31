import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-update-video-details",
  name: "Update Video Details",
  description: "Updates a video's metadata. [See the docs](https://developers.google.com/youtube/v3/docs/videos/update) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    videoId: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedVideo",
      ],
    },
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
      optional: true,
    },
    tags: {
      propDefinition: [
        youtubeDataApi,
        "tags",
      ],
    },
    regionCode: {
      propDefinition: [
        youtubeDataApi,
        "regionCode",
      ],
      default: "US",
    },
    categoryId: {
      propDefinition: [
        youtubeDataApi,
        "videoCategoryId",
        (c) => ({
          regionCode: c.regionCode,
        }),
      ],
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
