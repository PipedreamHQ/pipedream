import consts from "../../common/consts.mjs";

export default {
  async run({ $ }) {
    const params = {
      part: consts.LIST_PLAYLIST_ITEMS_PART,
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      requestBody: {
        snippet: {
          playlistId: this.playlistId,
          resourceId: {
            kind: "youtube#video",
          },
        },
      },
    };
    const responses = [];
    for (const videoId of this.videoIds) {
      params.requestBody.snippet.resourceId.videoId = videoId;
      const { data } = await this.youtubeDataApi.addPlaylistItem(params);
      responses.push(data);
    }
    $.export("$summary", `Successfully added ${this.videoIds.length} item(s) to playlist with ID ${this.playlistId}`);
    return responses;
  },
};
