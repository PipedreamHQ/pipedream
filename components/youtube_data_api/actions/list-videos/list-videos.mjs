import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../common/consts.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-list-videos",
  name: "List Videos",
  description: "Returns a list of videos that match the API request parameters. [See the documentation](https://developers.google.com/youtube/v3/docs/videos/list) for more information",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    youtubeDataApi,
    useCase: {
      propDefinition: [
        youtubeDataApi,
        "useCase",
      ],
      options: consts.LIST_VIDEOS_USE_CASES,
    },
    ...common.props,
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useCase === "id") {
      dynamicProps.id = {
        ...youtubeDataApi.propDefinitions.videoIds,
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
        ...youtubeDataApi.propDefinitions.regionCode,
        reloadProps: true,
      };
      dynamicProps.videoCategoryId = {
        type: "string",
        label: "Video Category ID",
        description: "The videoCategoryId parameter identifies the video category for which the chart should be retrieved. By default, charts are not restricted to a particular category.",
        optional: true,
        options: async () => {
          return this.regionCode?.length === 2
            ? await this.youtubeDataApi.listVideoCategoriesOpts(this.regionCode)
            : [];
        },
      };
    }
    return {
      ...dynamicProps,
      part: {
        ...youtubeDataApi.propDefinitions.part,
        options: consts.LIST_VIDEOS_PART_OPTS,
      },
      hl: {
        ...youtubeDataApi.propDefinitions.hl,
        options: async () => {
          return await this.youtubeDataApi.listI18nLanguagesOpts();
        },
      },
      maxResults: {
        ...youtubeDataApi.propDefinitions.maxResults,
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
        description: "The maxWidth parameter specifies the maximum width of the embedded player returned in the player.embedHtml property.\nYou can use this parameter to specify that instead of the default dimensions.",
        type: "integer",
        min: 72,
        max: 8192,
        optional: true,
      },
    };
  },
};
