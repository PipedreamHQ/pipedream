const youtube = require("../../youtube.app.js");

module.exports = {
  key: "youtube-new-videos-in-playlist",
  name: "New Videos in Playlist",
  description: "Emits an event for each new Youtube video added to a Playlist.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    youtube,
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "The ID of the playlist to search for new videos in.",
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
    let count = 0;
    let nextPageToken = null;
    let results;

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const publishedAfter = this.db.get("publishedAfter") || monthAgo;

    let params = {
      part: "contentDetails,id,snippet,status",
      playlistId: this.playlistId,
      pageToken: nextPageToken,
    };
    console.log(params);

    while (count < totalResults) {
      params.pageToken = nextPageToken;
      results = await this.youtube.getPlaylistItems(params);
      console.log(results.data);
      console.log(results.data.items);
      totalResults = results.data.pageInfo.totalResults;
      nextPageToken = results.data.nextPageToken;
      for (const video of results.data.items) {
        const publishedAt = new Date(video.snippet.publishedAt);
        if (publishedAt > new Date(publishedAfter)) {
          videos.push(video);
        }
        count++;
      }
    }

    this.db.set("publishedAfter", new Date());

    for (const video of videos) {
      this.$emit(video, {
        id: video.id,
        summary: video.snippet.title,
        ts: Date.now(),
      });
    }
  },
};
