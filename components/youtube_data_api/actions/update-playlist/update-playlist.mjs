import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../common/consts.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "youtube_data_api-update-playlist",
  name: "Update Playlist",
  description: "Modifies a playlist. For example, you could change a playlist's title, description, or privacy status. [See the documentation](https://developers.google.com/youtube/v3/docs/playlists/update) for more information",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    youtubeDataApi,
    id: {
      propDefinition: [
        youtubeDataApi,
        "userOwnedPlaylist",
      ],
      description: "The identifier of the playlist to update. E.g. `PLJswo-CV0rmlwxKysf33cUnyBp8JztH0k`",
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
      return {
        playlistIdAlert: {
          type: "alert",
          alertType: "error",
          content: "Error retrieving Playlist ID. The provided ID is either not valid or you don't have permission to fetch this data.",
        },
      };
    }
    dynamicProps.title = {
      ...youtubeDataApi.propDefinitions.title,
      description: `The playlist's title.\n\n**Current title**: \`${playlist.snippet.title}\``,
      optional: true,
    };
    dynamicProps.description = {
      ...youtubeDataApi.propDefinitions.description,
      description: `The playlist's description.\n\n**Current title**: \`${playlist.snippet.description}\``,
      optional: true,
    };
    dynamicProps.privacyStatus = {
      label: "Privacy Status",
      description: `The playlist's privacy status.\n\n**Current privacy status**: \`${playlist.status.privacyStatus}\``,
      type: "string",
      options: consts.UPDATE_PLAYLIST_PRIVACY_STATUS_OPTS,
      optional: true,
    };
    return dynamicProps;
  },
};
