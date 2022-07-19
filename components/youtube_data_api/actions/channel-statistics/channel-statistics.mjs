import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-channel-statistics",
  name: "Channel Statistics",
  description: "Returns statistics from my YouTube Channel or by id. [See the docs](https://developers.google.com/youtube/v3/docs/channels/list) for more information",
  version: "0.0.6",
  type: "action",
  props: {
    youtubeDataApi,
    useCase: {
      label: "Use Case",
      description: "Select your use case to render the next properties.",
      type: "string",
      options: consts.LIST_CHANNEL_STATISTICS_USE_CASES,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useCase === "id") {
      dynamicProps.id = {
        label: "Id",
        description: "The id parameter specifies a comma-separated list of the YouTube channel ID(s) for the resource(s) that are being retrieved. In a channel resource, the id property specifies the channel's YouTube channel ID.",
        type: "string",
      };
    }
    return {
      ...dynamicProps,
      hl: {
        label: "HL",
        description: "The hl parameter instructs the API to retrieve localized resource metadata for a specific application language that the YouTube website supports. The parameter value must be a language code included in the list returned by the i18nLanguages.list method.",
        type: "string",
        optional: true,
        options: async () => {
          return await this.youtubeDataApi.listI18nLanguagesOpts();
        },
      },
      maxResults: {
        label: "Max Results",
        description: "The maxResults parameter specifies the maximum number of items that should be returned in the result set.",
        type: "integer",
        min: 1,
        max: 50,
        optional: true,
      },
      onBehalfOfContentOwner: {
        label: "On Behalf Of Content Owner",
        description: "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.",
        type: "string",
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const {
      id,
      onBehalfOfContentOwner,
      maxResults,
      hl,
    } = this.id;
    const part = consts.LIST_CHANNEL_STATISTICS_PART;
    const mine = this.useCase === "mine" ?
      true :
      undefined;
    const managedByMe = this.useCase === "managedByMe" ?
      true :
      undefined;
    const channels = (await this.youtubeDataApi.listChannels({
      id,
      mine,
      managedByMe,
      part,
      onBehalfOfContentOwner,
      maxResults,
      hl,
    })).data;
    $.export("$summary", `Successfully fetched "${channels.items.length}" channels`);
    return channels;
  },
};
