const youtube = require("https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js");

module.exports = {
  name: "New Videos by Location",
  description: "Emits an event for each new YouTube video tied to a location.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    location: {
      type: "string",
      label: "Location",
      description:
        "The location parameter, in conjunction with the locationRadius parameter, defines a circular geographic area and also restricts a search to videos that specify, in their metadata, a geographic location that falls within that area. The parameter value is a string that specifies latitude/longitude coordinates e.g. (37.42307,-122.08427).",
    },
    locationRadius: {
      type: "string",
      label: "Location Radius",
      description:
        "The parameter value must be a floating point number followed by a measurement unit. Valid measurement units are m, km, ft, and mi. For example, valid parameter values include 1500m, 5km, 10000ft, and 0.75mi. The API does not support locationRadius parameter values larger than 1000 kilometers.",
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
      location: this.location,
      locationRadius: this.locationRadius,
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
