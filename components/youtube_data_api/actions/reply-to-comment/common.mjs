export default {
  async run({ $ }) {
    const params = {
      part: [
        "id",
        "snippet",
      ],
      requestBody: {
        snippet: {
          textOriginal: this.text,
          parentId: this.commentThread,
        },
      },
    };

    const { data } = await this.youtubeDataApi.replyToComment(params);

    $.export("$summary", `Successfully created comment reply with ID ${data.id}`);

    return data;
  },
};

