import youtubeDataApi from "../../youtube_data_api_custom_app.app.mjs";
import common from "@pipedream/youtube_data_api/actions/update-playlist/common.mjs";
import consts from "@pipedream/youtube_data_api/common/consts.mjs";

export default {
  ...common,
  key: "youtube_data_api_custom_app-update-playlist",
  name: "Update Playlist",
  description: "Modifies a playlist. For example, you could change a playlist's title, description, or privacy status. **If you are submitting an update request, and your request does not specify a value for a property that already has a value, the property's existing value will be deleted.** [See the docs](https://developers.google.com/youtube/v3/docs/playlists/update) for more information",
  version: "0.0.3",
  type: "action",
  dedupe: "unique",
  props: {
    youtubeDataApi,
    id: {
      propDefinition: [
        youtubeDataApi,
        "playlistId",
      ],
      optional: false,
      reloadProps: true,
    },
    onBehalfOfContentOwner: {
      propDefinition: [
        youtubeDataApi,
        "onBehalfOfContentOwner",
      ],
      reloadProps: true,
    },
    ...common.props,
  },
  async additionalProps() {
    const dynamicProps = {};
    const playlist = await this.fetchPlaylist(this.id);
    if (!playlist) {
      return dynamicProps;
    }
    dynamicProps.title = {
      ...youtubeDataApi.propDefinitions.title,
      description: `The playlist's title.\n\n**Current title**: \`${playlist.snippet.title}\``,
    };
    dynamicProps.description = {
      ...youtubeDataApi.propDefinitions.description,
      description: `The playlist's description.\n\n**Current title**: \`${playlist.snippet.description}\``,
    };
    dynamicProps.privacyStatus = {
      label: "Privacy Status",
      description: `The playlist's privacy status.\n\n**Current privacy status**: \`${playlist.status.privacyStatus}\``,
      type: "string",
      options: consts.UPDATE_PLAYLIST_PRIVACY_STATUS_OPTS,
    };
    return dynamicProps;
  },
};
