import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-list-activities",
  name: "List Activities",
  description: "Returns a list of channel activity events that match the request criteria. [See the docs](https://developers.google.com/youtube/v3/docs/channels/list) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    useCase: {
      label: "Use Case",
      description: "Select your use case to render the next properties.",
      type: "string",
      options: consts.LIST_ACTIVITIES_USE_CASES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    let dynamicProps = {};
    if (this.useCase === "channelId") {
      dynamicProps.channelId = {
        label: "Channel Id",
        description: "The channelId parameter specifies a unique YouTube channel ID. The API will then return a list of that channel's activities.",
        type: "string",
      };
    }
    dynamicProps = {
      ...dynamicProps,
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
      maxResults: {
        label: "Max Results",
        description: "The maxResults parameter specifies the maximum number of items that should be returned in the result set.",
        type: "integer",
        min: 1,
        max: 50,
        optional: true,
      },
      regionCode: {
        label: "Region Code",
        description: "The regionCode parameter instructs the API to return results for the specified country. The parameter value is an ISO 3166-1 alpha-2 country code. For example: US, GB, BR",
        type: "string",
        optional: true,
      },
    };
    return dynamicProps;
  },
  async run({ $ }) {
    const {
      channelId,
      regionCode,
      maxResults,
      publishedBefore,
      publishedAfter,
    } = this;
    const part = consts.LIST_ACTIVITIES_PART;
    const mine = this.useCase === "mine" ?
      true :
      undefined;
    const activities = (await this.youtubeDataApi.listActivities({
      channelId,
      mine,
      part,
      regionCode,
      maxResults,
      publishedBefore,
      publishedAfter,
    })).data;
    $.export("$summary", `Successfully fetched "${activities.items.length}" activities`);
    return activities;
  },
};
