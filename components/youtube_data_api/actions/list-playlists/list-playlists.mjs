import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../common/consts.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-list-playlists",
  name: "List Playlists",
  description: "Returns a collection of playlists that match the API request parameters. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/list) for more information",
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
      options: consts.LIST_PLAYLISTS_USE_CASE,
    },
    ...common.props,
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useCase === "id") {
      dynamicProps.id = {
        ...youtubeDataApi.propDefinitions.playlistId,
      };
    }
    else if (this.useCase === "channelId") {
      dynamicProps.channelId = {
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
      onBehalfOfContentOwnerChannel: {
        ...youtubeDataApi.propDefinitions.onBehalfOfContentOwnerChannel,
      },
    };
  },
};
