import consts from "../../common/consts.mjs";

export default {
  methods: {
    async fetchPlaylist(id) {
      let playlist;
      if (id) {
        const { data } = await this.youtubeDataApi.listPlaylists({
          part: consts.UPDATE_PLAYLIST_PART,
          id,
        });
        playlist = data.items.pop();
      }
      if (!playlist) {
        console.log("The provided ID is either not valid or you don't have permission to fetch this data.");
        return;
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
    const { data: updatedPlaylist } = await this.youtubeDataApi.updatePlaylist({
      onBehalfOfContentOwner,
      part: consts.UPDATE_PLAYLIST_PART,
      requestBody: {
        etag: playlist.etag,
        id: playlist.id,
        kind: playlist.kind,
        snippet: {
          title: title || playlist.snippet?.title,
          description: description || playlist.snippet?.description,
        },
        status: {
          privacyStatus: privacyStatus || playlist.status?.privacyStatus,
        },
      },
    });
    $.export("$summary", `Successfully updated playlist "${playlist.id}"`);

    return updatedPlaylist;
  },
};
