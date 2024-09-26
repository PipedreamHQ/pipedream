export default {
  async run({ $ }) {
    const params = {
      id: this.playlistId,
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
    };
    await this.youtubeDataApi.deletePlaylist(params);
    $.export("$summary", `Successfully deleted playlist with ID ${this.playlistId}`);
    // nothing to return
  },
};
