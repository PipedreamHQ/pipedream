import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-update-playlist",
  name: "Update Playlist",
  description: "Modifies a playlist. For example, you could change a playlist's title, description, or privacy status. **If you are submitting an update request, and your request does not specify a value for a property that already has a value, the property's existing value will be deleted.** [See the docs](https://developers.google.com/youtube/v3/docs/playlists/update) for more information",
  version: "0.0.1",
  type: "action",
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
  methods: {
    async fetchPlaylist(id) {
      let playlist = null;
      if (id) {
        const playlistsData = (await this.youtubeDataApi.listPlaylists({
          part: consts.UPDATE_PLAYLIST_PART,
          id: id,
        })).data;
        playlist = playlistsData.items.pop();
      }
      if (!playlist) {
        console.log("The provided id is either not valid or you can't fetch this data.");
        return null;
      }
      return playlist;
    },
  },
  async run({ $ }) {
    const {
      id,
      title,
      description,
      privacyStatus,
      onBehalfOfContentOwner,
    } = this;

    const playlist = await this.fetchPlaylist(id);
    const updatedPlaylist = (await this.youtubeDataApi.updatePlaylist({
      onBehalfOfContentOwner,
      part: consts.UPDATE_PLAYLIST_PART,
      requestBody: {
        etag: playlist.etag,
        id: playlist.id,
        kind: playlist.kind,
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus,
        },
      },
    })).data;
    $.export("$summary", `Successfully updated playlist "${playlist.id}"`);

    return updatedPlaylist;
  },
};
