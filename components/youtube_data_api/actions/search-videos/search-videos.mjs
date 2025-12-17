import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../common/consts.mjs";

export default {
  key: "youtube_data_api-search-videos",
  name: "Search Videos",
  description: "Returns a list of videos that match the search parameters. [See the documentation](https://developers.google.com/youtube/v3/docs/search/list) for more information",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "The method that will be used to order resources in the API response. The default value is `relevance`",
      options: consts.VIDEO_SORT_ORDER,
      optional: true,
    },
    maxResults: {
      propDefinition: [
        youtubeDataApi,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.youtubeDataApi.paginate(
      this.youtubeDataApi.getVideos,
      {
        part: "snippet",
        type: "video",
        q: this.q,
        channelId: this.channelId,
        location: this.location,
        locationRadius: this.locationRadius,
        videoDefinition: this.videoDefinition,
        videoDuration: this.videoDuration,
        videoCaption: this.videoCaption,
        videoLicense: this.videoLicense,
        order: this.sortOrder,
        regionCode: this.regionCode,
        videoCategoryId: this.videoCategoryId,
      },
      this.maxResults,
    );

    const videos = [];
    for await (const video of results) {
      videos.push(video);
    }
    $.export("$summary", `Successfully fetched ${videos.length} video${videos.length === 1
      ? ""
      : "s"}`);
    return videos;
  },
};
