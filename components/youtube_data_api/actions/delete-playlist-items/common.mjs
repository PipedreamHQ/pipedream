export default {
  async run({ $ }) {
    const params = {
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
    };
    const youtube = await this.youtubeDataApi.youtube();
    for (const videoId of this.videoIds) {
      params.id = videoId;
      await youtube.playlistItems.delete(params);
    }
    $.export("$summary", `Successfully deleted ${this.videoIds.length} item${this.videoIds.length === 1
      ? ""
      : "s"} from playlist with ID ${this.playlistId}`);
    // nothing to return
  },
};
