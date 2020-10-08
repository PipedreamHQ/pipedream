const youtube = require("https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js");

module.exports = {
  name: "New Videos in Channel",
  description: "Emits an event for each new Youtube video posted to a Channel.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    channelId: {
      type: "string",
      label: "Channel ID",
      description: "The ID of the channel to search for new videos in.",
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
    const monthAgo = now;
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const publishedAfter = this.db.get("publishedAfter") || monthAgo;

    let params = {
      part: "snippet",
      type: "video",
      channelId: this.channelId,
      pageToken: null,
      publishedAfter,
    };

    while (count < totalResults) {
      params.pageToken = nextPageToken;
      results = await this.youtube.getVideos(params);
      totalResults = results.data.pageInfo.totalResults;
      nextPageToken = results.data.nextPageToken;
      results.data.items.forEach(function (video) {
        videos.push(video);
        count++;
      });
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
