import common from "../common.mjs";

const MAX_SAMPLE_EVENTS = 5;

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
    _getHasRun() {
      return this.db.get("hasRun");
    },
    _setHasRun() {
      this.db.set("hasRun", true);
    },
  },
  async run() {
    const afterTs = this._getPublishedAfter();
    let maxPublishedAfter = afterTs || 0;

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

    const hasRun = this._getHasRun();
    if (!hasRun) this._setHasRun();

    comments.forEach((comment, index) => {
      const publishedAt = Date.parse(comment.snippet.publishedAt);
      if ((hasRun || index < MAX_SAMPLE_EVENTS) && (!afterTs || publishedAt > afterTs)) {
        const meta = this.generateMeta(comment);
        this.$emit(comment, meta);
      }
      if (publishedAt > maxPublishedAfter) {
        maxPublishedAfter = publishedAt;
      }
    });

    this._setPublishedAfter(maxPublishedAfter);
  },
};
