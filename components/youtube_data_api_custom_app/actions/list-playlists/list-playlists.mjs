import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/list-playlists/common.mjs";
import consts from "@pipedream/youtube_data_api/common/consts.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-list-playlists",
  name: "List Playlists",
  description: "Returns a collection of playlists that match the API request parameters. [See the docs](https://developers.google.com/youtube/v3/docs/playlists/list) for more information",
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
      part: {
        ...youtubeDataApi.propDefinitions.part,
        options: consts.LIST_PLAYLISTS_PART_OPTS,
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
      onBehalfOfContentOwner: {
        ...youtubeDataApi.propDefinitions.onBehalfOfContentOwner,
      },
      onBehalfOfContentOwnerChannel: {
        ...youtubeDataApi.propDefinitions.onBehalfOfContentOwnerChannel,
      },
    };
  },
};
