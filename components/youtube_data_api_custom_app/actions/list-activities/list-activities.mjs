import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/list-activities/common.mjs";
import consts from "@pipedream/youtube_data_api/common/consts.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-list-activities",
  name: "List Activities",
  description: "Returns a list of channel activity events that match the request criteria. [See the docs](https://developers.google.com/youtube/v3/docs/channels/list) for more information",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    useCase: {
      propDefinition: [
        youtubeDataApi,
        "useCase",
      ],
      options: consts.LIST_ACTIVITIES_USE_CASES,
    },
    ...common.props,
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useCase === "channelId") {
      dynamicProps.channelId = {
        ...youtubeDataApi.propDefinitions.channelId,
      };
    }
    return {
      ...dynamicProps,
      maxResults: {
        ...youtubeDataApi.propDefinitions.maxResults,
      },
      regionCode: {
        ...youtubeDataApi.propDefinitions.regionCode,
      },
      publishedAfter: {
        label: "Published After",
        description: "The publishedAfter parameter specifies the earliest date and time that an activity could have occurred for that activity to be included in the API response. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.",
        type: "string",
        optional: true,
      },
      publishedBefore: {
        label: "Published Before",
        description: "The publishedBefore parameter specifies the date and time before which an activity must have occurred for that activity to be included in the API response. The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.",
        type: "string",
        optional: true,
      },
    };
  },
};
