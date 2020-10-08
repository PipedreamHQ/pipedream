const youtube = require("https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js");

module.exports = {
  name: "New Videos by Username",
  description: "Emits an event for each new Youtube video tied to a username.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    username: {
      type: "string",
      label: "Username",
      description: "Search for new videos uploaded by the YouTube Username.",
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
    let channelIds = [];
    let totalResults;
    let nextPageToken;
    let count;
    let results;

    const now = new Date();
    const monthAgo = now;
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const publishedAfter = this.db.get("publishedAfter") || monthAgo;

    let params = {
      part: "id",
      forUsername: this.username,
    };

    channels = await this.youtube.getChannels(params);
    channels.data.items.forEach(function (channel) {
      channelIds.push(channel.id);
    });

    for (const channelId of channelIds) {
      count = 0;
      totalResults = 1;
      nextPageToken = null;
      params = {
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
        if (!nextPageToken) break;
        if (!results.data.items || results.data.items.length < 1) break;
      }
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
