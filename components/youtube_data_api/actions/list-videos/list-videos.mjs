import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-list-videos",
  name: "List Videos",
  description: "Returns a list of videos that match the API request parameters. [See the docs](https://developers.google.com/youtube/v3/docs/videos/list) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    useCase: {
      label: "Use Case",
      description: "Select your use case to render the next properties.",
      type: "string",
      options: consts.LIST_VIDEOS_USE_CASES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    let dynamicProps = {};
    if (this.useCase === "id") {
      dynamicProps.id = {
        label: "Id",
        description: "The id parameter specifies a comma-separated list of the YouTube video ID(s) for the resource(s) that are being retrieved. In a video resource, the id property specifies the video's ID.",
        type: "string[]",
      };
    }
    else if (this.useCase === "myRating") {
      dynamicProps.myRating = {
        label: "My Rating",
        description: "Set this parameter's value to like or dislike to instruct the API to only return videos liked or disliked by the authenticated user.",
        type: "string",
        options: consts.LIST_VIDEOS_MY_RATING_OPTS,
      };
    }
    else if (this.useCase === "chart") {
      dynamicProps.regionCode = {
        label: "Region Code",
        description: "The regionCode parameter instructs the API to select a video chart available in the specified region. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR",
        type: "string",
        reloadProps: true,
        optional: true,
      };
      if (this.regionCode && this.regionCode.length === 2) {
        dynamicProps.videoCategoryId = {
          label: "Video Category Id",
          description: "The videoCategoryId parameter identifies the video category for which the chart should be retrieved. By default, charts are not restricted to a particular category.",
          type: "string",
          optional: true,
          options: async () => {
            return await this.youtubeDataApi.listVideoCategoriesOpts(this.regionCode);
          },
        };
      }
    }
    dynamicProps = {
      ...dynamicProps,
      part: {
        label: "Part",
        description: "The part parameter specifies a comma-separated list of one or more video resource properties that the API response will include.",
        type: "string[]",
        options: consts.LIST_VIDEOS_PART_OPTS,
      },
      hl: {
        label: "HL",
        description: "The hl parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports. The parameter value must be a language code included in the list returned by the i18nLanguages.list method.",
        type: "string",
        optional: true,
        options: async () => {
          return await this.youtubeDataApi.listI18nLanguagesOpts();
        },
      },
      maxHeight: {
        label: "Max Height",
        description: "The maxHeight parameter specifies the maximum height of the embedded player returned in the player.embedHtml property. You can use this parameter to specify that instead of the default dimensions, If the maxWidth parameter is also provided, the player may be shorter than the maxHeight in order to not violate the maximum width.",
        type: "integer",
        min: 72,
        max: 8192,
        optional: true,
      },
      maxWidth: {
        label: "Max Height",
        description: "The maxWidth parameter specifies the maximum width of the embedded player returned in the player.embedHtml property. You can use this parameter to specify that instead of the default dimensions.",
        type: "integer",
        min: 72,
        max: 8192,
        optional: true,
      },
      maxResults: {
        label: "Max Results",
        description: "The maxResults parameter specifies the maximum number of items that should be returned in the result set.",
        type: "integer",
        min: 1,
        max: 50,
        optional: true,
      },
    };
    return dynamicProps;
  },
  async run({ $ }) {
    const {
      useCase,
      id,
      myRating,
      part,
      hl,
      maxHeight,
      maxWidth,
      maxResults,
      videoCategoryId,
      regionCode,
    } = this;

    const chart = useCase === "chart" ?
      "mostPopular" :
      undefined;

    const videos = (await this.youtubeDataApi.listVideos({
      part,
      id,
      chart,
      myRating,
      hl,
      maxHeight,
      maxWidth,
      maxResults,
      videoCategoryId,
      regionCode,
    })).data;
    $.export("$summary", `Successfully fetched "${videos.items.length}" videos`);
    return videos;
  },
};
