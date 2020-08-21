const axios = require("axios");
const youtube = require("https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js");

module.exports = {
  name: "Youtube - New Videos in Playlist",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "The ID of the playlist to search for new videos in.",
      default: "",
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
      part : 'contentDetails,id,snippet,status',
      playlistId : this.playlistId,
      pageToken : nextPageToken,
      publishedAfter: past
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

    for (const video of videos) {
      this.$emit(video, {
        id: video.id.videoId,
        summary: video.snippet.title,
        ts: Date.now(),
      });
    }
  },
};
