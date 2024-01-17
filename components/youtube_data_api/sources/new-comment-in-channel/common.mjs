import common from "../common.mjs";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    deploy() {},
  },
  methods: {
    ...common.methods,
    generateMeta(comment) {
      return {
        id: comment.id,
        summary: comment.snippet.textDisplay,
        ts: Date.parse(comment.snippet.publishedAt),
      };
    },
  },
  async run() {
    const publishedAfter = this._getPublishedAfter();
    let maxPublishedAfter = publishedAfter || 0;

    const params = {
      part: "id,replies,snippet",
      allThreadsRelatedToChannelId: this.channelId,
    };

    const items = [];
    while (true) {
      const { data } = await this.youtubeDataApi.listCommentThreads(params);
      items.push(...data.items);
      if (data.nextPageToken) {
        params.pageToken = data.nextPageToken;
      } else {
        break;
      }
    }

    const comments = [];
    for (const item of items) {
      comments.push(item.snippet.topLevelComment);
      if (item?.replies?.comments) {
        comments.push(...item.replies.comments);
      }
    }

    for (const comment of comments) {
      const publishedAt = Date.parse(comment.snippet.publishedAt);
      if (!publishedAfter || publishedAt > publishedAfter) {
        const meta = this.generateMeta(comment);
        this.$emit(comment, meta);
      }
      if (publishedAt > maxPublishedAfter) {
        maxPublishedAfter = publishedAt;
      }
    }

    this._setPublishedAfter(maxPublishedAfter);
  },
};
