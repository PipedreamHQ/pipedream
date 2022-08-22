import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-channel-statistics",
  name: "Channel Statistics",
  description: "Returns statistics from my YouTube Channel or by id. [See the docs](https://developers.google.com/youtube/v3/docs/channels/list) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    useCase: {
      propDefinition: [
        youtubeDataApi,
        "useCase",
      ],
      options: consts.LIST_CHANNEL_STATISTICS_USE_CASES,
    },
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useCase === "id") {
      dynamicProps.id = {
        ...youtubeDataApi.propDefinitions.channelId,
      };
    }
    return {
      ...dynamicProps,
      hl: {
        ...youtubeDataApi.propDefinitions.hl,
        options: async () => {
          return await this.youtubeDataApi.listI18nLanguagesOpts();
        },
      },
      maxResults: {
        ...youtubeDataApi.propDefinitions.maxResults,
      },
      onBehalfOfContentOwner: {
        ...youtubeDataApi.propDefinitions.onBehalfOfContentOwner,
      },
    };
  },
  async run({ $ }) {
    const {
      id,
      onBehalfOfContentOwner,
      maxResults,
      hl,
    } = this;
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
