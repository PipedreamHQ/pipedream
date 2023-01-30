export default {
  async run({ $ }) {
    const part = [
      "id",
      "snippet",
    ];
    const { data } = await this.youtubeDataApi.listVideos({
      part,
      id: this.videoId,
    }); console.log(data);
    const [
      video,
    ] = data.items; console.log(video);

    const description = this.description || video.snippet.description;
    const tags = this.tags || video.snippet.tags;

    const params = {
      part,
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      resource: {
        id: this.videoId,
        snippet: {
          categoryId: this.categoryId,
          title: this.title,
        },
      },
    };

    if (description) {
      params.resource.snippet.description = description;
    }
    if (tags) {
      params.resource.snippet.tags = tags;
    }

    console.log(params);
    const { data: response } = await this.youtubeDataApi.updateVideo(params);

    $.export("$summary", `Successfully updated video, "${this.title}"`);
    return response;
  },
};
