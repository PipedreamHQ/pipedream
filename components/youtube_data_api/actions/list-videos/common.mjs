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

    const videos = (await this.youtubeDataApi.listVideos({
      part,
      id,
      chart,
      myRating,
      hl,
      maxHeight,
      maxWidth,
      maxResults,
      videoCategoryId,
      regionCode,
    })).data;
    $.export("$summary", `Successfully fetched ${videos.items.length} video(s)`);
    return videos;
  },
};
