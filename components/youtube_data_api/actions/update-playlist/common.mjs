import consts from "../../consts.mjs";

export default {
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
