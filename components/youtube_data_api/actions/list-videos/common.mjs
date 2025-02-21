export default {
  async run({ $ }) {
    const {
      useCase,
      id,
      myRating,
      part,
      hl,
      maxHeight,
      maxWidth,
      maxResults,
      videoCategoryId,
      regionCode,
    } = this;

    const chart = useCase === "chart" ?
      "mostPopular" :
      undefined;

    const { data: videos } = await this.youtubeDataApi.listVideos({
      part,
      id: id && id.join(),
      chart,
      myRating,
      hl,
      maxHeight,
      maxWidth,
      maxResults,
      videoCategoryId,
      regionCode,
    });
    $.export("$summary", `Successfully fetched ${videos.items.length} video${videos.items.length === 1
      ? ""
      : "s"}`);
    return videos;
  },
};
