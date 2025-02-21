import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    deploy() {
      if (!this.channelId && !this.videoId) {
        throw new ConfigurationError("Must enter one of `channelId` or `videoId`");
      }
    },
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
    };
    if (this.videoId) {
      params.videoId = this.videoId;
    } else {
      params.allThreadsRelatedToChannelId = this.channelId;
    }

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
        this.emitEvent(comment);
      }
      maxPublishedAfter = Math.max(maxPublishedAfter, publishedAt);
    }

    this._setPublishedAfter(maxPublishedAfter);
  },
};
