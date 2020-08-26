const youtube = require("https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js");

module.exports = {
  name: "New Videos by Search",
  description:
    "Emits an event for each new YouTube video matching a search query.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    q: {
      type: "string",
      label: "Search Query",
      description: "Search for new videos that match these keywords.",
    },
    maxResults: {
      type: "integer",
      label: "Maximum Results",
      description:
        "The maximum number of results to return. Should be divisible by 5 (ex. 5, 10, 15).",
      default: 5,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let videos = [];
    let totalResults = 1;
    let nextPageToken = null;
    let count = 0;
    let results;

    const now = new Date();
    const dayAgo = now;
    dayAgo.setDate(dayAgo.getDate() - 1);
    const publishedAfter = this.db.get("publishedAfter") || dayAgo;

    let params = {
      part: "snippet",
      type: "video",
      q: this.q,
      pageToken: nextPageToken,
      publishedAfter,
    };

    while (count < totalResults && count < this.maxResults) {
      params.pageToken = nextPageToken;
      results = await this.youtube.getVideos(params);
      totalResults = results.data.pageInfo.totalResults;
      nextPageToken = results.data.nextPageToken;
      results.data.items.forEach(function (video) {
        videos.push(video);
        count++;
      });
      if (!nextPageToken) break;
    }

    this.db.set("publishedAfter", now);

    for (const video of videos) {
      this.$emit(video, {
        id: video.id.videoId,
        summary: video.snippet.title,
        ts: Date.now(),
      });
    }
  },
};
