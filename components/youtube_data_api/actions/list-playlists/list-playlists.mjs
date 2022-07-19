import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-list-playlists",
  name: "List Playlists",
  description: "Returns a collection of playlists that match the API request parameters. [See the docs](https://developers.google.com/youtube/v3/docs/playlists/list) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    youtubeDataApi,
    useCase: {
      label: "Use Case",
      description: "Select your use case to render the next properties.",
      type: "string",
      options: consts.LIST_PLAYLISTS_USE_CASE,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const dynamicProps = {};
    if (this.useCase === "id") {
      dynamicProps.id = {
        label: "Id",
        description: "The id parameter specifies a comma-separated list of the YouTube playlist ID(s) for the resource(s) that are being retrieved. In a playlist resource, the id property specifies the playlist's YouTube playlist ID.",
        type: "string[]",
      };
    }
    else if (this.useCase === "channelId") {
      dynamicProps.channelId = {
        label: "Channel Id",
        description: "This value indicates that the API should only return the specified channel's playlists.",
        type: "string",
      };
    }
    return {
      ...dynamicProps,
      part: {
        label: "Part",
        description: "The part parameter specifies a comma-separated list of one or more video resource properties that the API response will include.",
        type: "string[]",
        options: consts.LIST_PLAYLISTS_PART_OPTS,
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
      onBehalfOfContentOwnerChannel: {
        label: "On Behalf Of Content Owner Channel",
        description: "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.",
        type: "string",
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const {
      useCase,
      id,
      channelId,
      part,
      hl,
      maxResults,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
    } = this;

    const mine = useCase === "mine" ?
      true :
      undefined;

    const playlists = (await this.youtubeDataApi.listPlaylists({
      part,
      id,
      mine,
      channelId,
      hl,
      onBehalfOfContentOwner,
      onBehalfOfContentOwnerChannel,
      maxResults,
    })).data;
    $.export("$summary", `Successfully fetched "${playlists.items.length}" playlists`);
    return playlists;
  },
};
