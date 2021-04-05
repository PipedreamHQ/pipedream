const youtube = require("../youtube.app.js");

module.exports = {
  props: {
    youtube,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // every 15 minutes
      },
    },
  },
  methods: {
    _getPublishedAfter() {
      return this.db.get("publishedAfter");
    },
    _setPublishedAfter(publishedAfter) {
      this.db.set("publishedAfter", publishedAfter);
    },
    generateMeta(video) {
      const { id, snippet } = video;
      return {
        id: id.videoId,
        summary: snippet.title,
        ts: Date.parse(snippet.publishedAt),
      };
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
    // paginate through results from getVideos(), emit each video, and return the
    // most recent date that a video was published
    async paginateVideos(params) {
      let count = 0;
      let totalResults = 1;
      let lastPublished;
      while (
        count < totalResults &&
        (!params.maxResults || count < params.maxResults)
      ) {
        const results = (await this.youtube.getVideos(params)).data;
        totalResults = results.pageInfo.totalResults;
        for (const video of results.items) {
          if (!lastPublished) lastPublished = video.snippet.publishedAt;
          this.emitEvent(video);
          count++;
        }
        if (!results.items || results.items.length < 1) break;
        if (!results.nextPageToken) break;
        else params.pageToken = results.nextPageToken;
      }
      return lastPublished;
    },
  },
  async run(event) {
    let publishedAfter = this._getPublishedAfter();
    const componentParams = this.getParams();
    const params = {
      ...componentParams,
      part: "snippet",
      type: "video",
      order: "date",
    };
    if (publishedAfter) params.publishedAfter = publishedAfter;
    else params.maxResults = 10;
    publishedAfter = await this.paginateVideos(params);
    if (publishedAfter) this._setPublishedAfter(publishedAfter);
  },
};