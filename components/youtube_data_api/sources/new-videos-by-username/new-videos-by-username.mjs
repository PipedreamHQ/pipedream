import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "youtube_data_api-new-videos-by-username",
  name: "New Videos by Username",
  description: "Emit new event for each new Youtube video tied to a username.",
  version: "0.0.5",
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
      const channels = (await this.youtubeDataApi.getChannels(channelParams)).data;
      if (!channels.items) {
        throw new Error(`A channel for username "${this.username}" is not found`);
      }
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
  async run() {
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
