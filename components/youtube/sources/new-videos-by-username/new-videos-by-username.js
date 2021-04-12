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
  hooks: {
    ...common.hooks,
    async deploy() {
      const channelIds = await this.getChannelIds();

      const params = {
        ...this._getBaseParams(),
        maxResults: 10,
      };

      const lastPublished = await this.loopThroughChannels(channelIds, params);

      if (lastPublished) this._setPublishedAfter(lastPublished);
      else this._setPublishedAfter(new Date());
    },
  },
  methods: {
    ...common.methods,
    getParams(channelId) {
      return {
        channelId,
      };
    },
    async getChannelIds() {
      const channelParams = {
        part: "id",
        forUsername: this.username,
      };
      const channels = (await this.youtube.getChannels(channelParams)).data;
      const channelIds = channels.items.map((channel) => {
        return channel.id;
      });
      return channelIds;
    },
    async loopThroughChannels(channelIds, baseParams) {
      let lastPublished;
      for (const channelId of channelIds) {
        const params = {
          ...baseParams,
          ...this.getParams(channelId),
        };
        const lastPublishedInChannel = await this.paginateVideos(params);
        if (
          !lastPublished ||
          Date.parse(lastPublishedInChannel) > Date.parse(lastPublished)
        )
          lastPublished = lastPublishedInChannel;
      }
      return lastPublished;
    },
  },
  async run(event) {
    let publishedAfter = this._getPublishedAfter();
    const channelIds = await this.getChannelIds();

    const params = {
      ...this._getBaseParams(),
      publishedAfter,
    };

    const lastPublished = await this.loopThroughChannels(channelIds, params);
    if (lastPublished) this._setPublishedAfter(lastPublished);
  },
};