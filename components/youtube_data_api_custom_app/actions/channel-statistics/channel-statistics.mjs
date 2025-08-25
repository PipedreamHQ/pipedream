import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/channel-statistics/common.mjs";
import consts from "@pipedream/youtube_data_api/common/consts.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-channel-statistics",
  name: "Channel Statistics",
  description: "Returns statistics from my YouTube Channel or by id. [See the docs](https://developers.google.com/youtube/v3/docs/channels/list) for more information",
  version: "0.0.3",
  type: "action",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    useCase: {
      propDefinition: [
        youtubeDataApi,
        "useCase",
      ],
      options: consts.LIST_CHANNEL_STATISTICS_USE_CASES,
    },
    ...common.props,
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
};
