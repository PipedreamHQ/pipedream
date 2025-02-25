export default {
  async run({ $ }) {
    const part = [
      "id",
      "snippet",
    ];
    const { data } = await this.youtubeDataApi.listVideos({
      part,
      id: this.videoId,
    });
    const [
      video,
    ] = data.items;

    const params = {
      part,
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      resource: {
        id: this.videoId,
        snippet: {
          categoryId: this.categoryId || video.snippet.categoryId,
          title: this.title || video.snippet.title,
          description: this.description || video.snippet.description,
          tags: this.tags || video.snippet.tags,
        },
      },
    };

    const { data: response } = await this.youtubeDataApi.updateVideo(params);

    $.export("$summary", `Successfully updated video with ID: "${this.videoId}"`);
    return response;
  },
};
