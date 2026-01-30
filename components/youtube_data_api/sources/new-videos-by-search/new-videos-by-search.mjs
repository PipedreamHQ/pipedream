import youtubeDataApi from "../../youtube_data_api.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-by-search",
  name: "New Videos by Search",
  description: "Emit new event for each new YouTube video matching the search criteria.",
  version: "0.0.11",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    q: {
      propDefinition: [
        youtubeDataApi,
        "q",
      ],
    },
    channelId: {
      propDefinition: [
        youtubeDataApi,
        "channelId",
      ],
      optional: true,
    },
    videoDuration: {
      propDefinition: [
        youtubeDataApi,
        "videoDuration",
      ],
    },
    videoDefinition: {
      propDefinition: [
        youtubeDataApi,
        "videoDefinition",
      ],
    },
    videoCaption: {
      propDefinition: [
        youtubeDataApi,
        "videoCaption",
      ],
    },
    videoLicense: {
      propDefinition: [
        youtubeDataApi,
        "videoLicense",
      ],
    },
    regionCode: {
      propDefinition: [
        youtubeDataApi,
        "regionCode",
      ],
    },
    videoCategoryId: {
      propDefinition: [
        youtubeDataApi,
        "videoCategoryId",
        (c) => ({
          regionCode: c.regionCode,
        }),
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        youtubeDataApi,
        "location",
      ],
    },
    locationRadius: {
      propDefinition: [
        youtubeDataApi,
        "locationRadius",
      ],
    },
    maxResults: {
      propDefinition: [
        youtubeDataApi,
        "maxResults",
      ],
    },
    ...common.props,
  },
};
