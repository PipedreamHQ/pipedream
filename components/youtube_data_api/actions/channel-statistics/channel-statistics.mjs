import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../common/consts.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-channel-statistics",
  name: "Channel Statistics",
  description: "Returns statistics from my YouTube Channel or by id. [See the documentation](https://developers.google.com/youtube/v3/docs/channels/list) for more information",
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
