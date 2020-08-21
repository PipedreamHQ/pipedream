const axios = require('axios')
const youtube = require("https://github.com/PipedreamHQ/pipedream/components/youtube/youtube.app.js");

module.exports = {
  name: "Youtube - New Videos by Username",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    youtube,
    username: {
      type: "string",
      label: "Username",
      description: "Search for new videos uploaded by the YouTube Username.",
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
    let channelIds = [];
    let totalResults;
    let nextPageToken;
    let count;
    let results;

    const intervalMs = 1000 * (event.interval_seconds || 300); // fall through to default for manual testing
    const now = new Date();
    const past = new Date(now.getTime() - intervalMs);
    const updatedMin = past.toISOString();

    let params = {
      part: "id",
      forUsername: this.username,
    };

    channels = await this.youtube.getChannels(params);
    channels.data.items.forEach(function(channel) {
    	channelIds.push(channel.id);
    });

    for(const channelId of channelIds) {
    	count = 0;
    	totalResults = 1;
    	nextPageToken = null;
    	params = {
      		part: "snippet",
      		type: "video",
      		channelId: this.channelId,
      		pageToken: null,
      		publishedAfter: updatedMin
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

    for (const video of videos) {
      this.$emit(video, {
        id: video.id.videoId,
        summary: video.snippet.title,
        ts: Date.now(),
      });
    }
  },
};