export default {
  async run({ $ }) {
    const params = {
      part: [
        "id",
        "snippet",
      ],
      onBehalfOfContentOwner: this.onBehalfOfContentOwner,
      resource: {
        id: this.videoId,
        snippet: {
          categoryId: this.categoryId,
          title: this.title,
          description: this.description,
          privacyStatus: this.privacyStatus,
          tags: this.tags,
        },
      },
    };
    console.log(params);
    const { data } = await this.youtubeDataApi.updateVideo(params);

    $.export("$summary", `Successfully updated video, "${this.title}"`);
    return data;
  },
};
