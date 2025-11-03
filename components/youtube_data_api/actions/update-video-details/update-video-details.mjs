import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-update-video-details",
  name: "Update Video Details",
  description: "Updates a video's metadata. [See the documentation](https://developers.google.com/youtube/v3/docs/videos/update) for more information",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
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
    },
    categoryId: {
      propDefinition: [
        youtubeDataApi,
        "videoCategoryId",
        (c) => ({
          regionCode: c.regionCode,
        }),
      ],
      optional: true,
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
