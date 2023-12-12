export default {
  async run({ $ }) {
    const params = {
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
    };
    const youtube = await this.youtubeDataApi.youtube();
    const responses = [];
    for (const videoId of this.videoIds) {
      params.id = videoId;
      const { data } = await youtube.playlistItems.delete(params);
      responses.push(data);
    }
    $.export("$summary", `Successfully deleted ${this.videoIds.length} item(s) from playlist with ID ${this.playlistId}`);
    // nothing to return
  },
};
