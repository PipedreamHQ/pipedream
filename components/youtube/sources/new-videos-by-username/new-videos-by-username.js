const common = require("../common.js");

module.exports = {
  ...common,
  key: "youtube-new-videos-by-username",
  name: "New Videos by Username",
  description: "Emits an event for each new Youtube video tied to a username.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    ...common.props,
    username: {
      type: "string",
      label: "Username",
      description: "Search for new videos uploaded by the YouTube Username.",
    },
  },
  methods: {
    ...common.methods,
    getParams(channelId) {
      return {
        part: "snippet",
        type: "video",
        order: "date",
        channelId,
      };
    },
  },
  async run(event) {
    let publishedAfter = this._getPublishedAfter();
    let lastPublished;

    const channelParams = {
      part: "id",
      forUsername: this.username,
    };

    const channels = (await this.youtube.getChannels(channelParams)).data;
    const channelIds = channels.items.map((channel) => {
      return channel.id;
    });

    for (const channelId of channelIds) {
      const params = this.getParams(channelId);
      if (publishedAfter) params.publishedAfter = publishedAfter;
      else params.maxResults = 10;
      const lastPublishedInChannel = await this.paginateVideos(params);
      if (
        !lastPublished ||
        Date.parse(lastPublishedInChannel) > Date.parse(lastPublished)
      )
        lastPublished = lastPublishedInChannel;
    }

    if (lastPublished) this._setPublishedAfter(lastPublished);
  },
};