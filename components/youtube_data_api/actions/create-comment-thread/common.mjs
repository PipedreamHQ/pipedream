import consts from "../../common/consts.mjs";

export default {
  async run({ $ }) {
    const params = {
      part: consts.LIST_COMMENT_THREAD_PART.join(),
      requestBody: {
        snippet: {
          channelId: this.channelId,
          topLevelComment: {
            snippet: {
              textOriginal: this.text,
            },
          },
        },
      },
    };
    if (this.videoId) {
      params.requestBody.snippet.videoId = this.videoId;
    }

    const { data } = await this.youtubeDataApi.createCommentThread(params);

    $.export("$summary", `Successfully created comment thread with ID ${data.id}`);

    return data;
  },
};

