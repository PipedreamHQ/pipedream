const axios = require("axios");
const youtube = require("https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js");

module.exports = {
  name: "Youtube - New Videos by Search",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    q: {
      type: "string",
      label: "Search Query",
      description: "Search for new videos that match these keywords.",
      default: "",
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
  methods: {},

  async run(event) {
    let videos = [];
    let totalResults = 1;
    let nextPageToken = null;
    let count = 0;
    let results;

    const intervalMs = 1000 * (event.interval_seconds || 300); // fall through to default for manual testing
    const now = new Date();
    const past = new Date(now.getTime() - intervalMs);
    const updatedMin = past.toISOString();

    let params = {
      part: "snippet",
      type: "video",
      q: this.q,
      pageToken: nextPageToken,
      publishedAfter: updatedMin,
    };

    while (count < totalResults && count < this.maxResults) {
      params.pageToken = nextPageToken;
      results = await this.getVideos(params);
      totalResults = results.data.pageInfo.totalResults;
      nextPageToken = results.data.nextPageToken;
      results.data.items.forEach(function (video) {
        videos.push(video);
        count++;
      });
      if (!nextPageToken) break;
    }

    for (const video of videos) {
      this.$emit(video, {
        id: video.id.videoId,
        summary: video.snippet.title,
        ts: Date.now(),
      });
    }
  },
};