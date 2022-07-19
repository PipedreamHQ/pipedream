import youtubeDataApi from "../../youtube_data_api.app.mjs";
import consts from "../../consts.mjs";

export default {
  key: "youtube_data_api-update-playlist",
  name: "Update Playlist",
  description: "Modifies a playlist. For example, you could change a playlist's title, description, or privacy status. If you are submitting an update request, and your request does not specify a value for a property that already has a value, the property's existing value will be deleted. [See the docs](https://developers.google.com/youtube/v3/docs/playlists/update) for more information",
  version: "0.0.13",
  type: "action",
  props: {
    youtubeDataApi,
    id: {
      label: "Id",
      description: "The id parameter specifies the YouTube playlist ID for the resource that will be update.",
      type: "string",
      reloadProps: true,
    },
    onBehalfOfContentOwner: {
      label: "On Behalf Of Content Owner",
      description: "This parameter can only be used in a properly authorized request. Note: This parameter is intended exclusively for YouTube content partners.",
      type: "string",
      optional: true,
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
      label: "Title",
      description: "The playlist title.",
      type: "string",
      default: playlist.snippet.title,
    };
    dynamicProps.description = {
      label: "Description",
      description: "The playlist description.",
      type: "string",
      default: playlist.snippet.description,
    };
    dynamicProps.privacyStatus = {
      label: "Privacy Status",
      description: "the playlist privacy status.",
      type: "string",
      options: consts.UPDATE_PLAYLIST_PRIVACY_STATUS_OPTS,
      default: playlist.status.privacyStatus,
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
