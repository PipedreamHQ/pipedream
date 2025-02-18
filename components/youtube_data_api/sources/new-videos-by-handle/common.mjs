import common from "../common/common.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    handle: {
      type: "string",
      label: "Handle",
      description: "Search for new videos uploaded by the YouTube Handle. Handles appear at the end of a channel's URL. For example, if the channel URL is `https://www.youtube.com/@pipedreamhq`, the Handle is `@pipedreamhq`.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.handle) {
      return props;
    }
    const channels = await this.getChannels();
    if (!channels.items) {
      props.alert = {
        type: "alert",
        alertType: "error",
        content: `A channel for handle "${this.handle}" was not found`,
        hidden: false,
      };
    }
    return props;
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const channelIds = await this.getChannelIds();
      const lastPublished = await this.loopThroughChannels(channelIds, {
        ...this._getBaseParams(),
        maxResults: 10,
      });
      this._setPublishedAfter(lastPublished || new Date());
    },
  },
  methods: {
    ...common.methods,
    getParams(channelId) {
      return {
        channelId,
      };
    },
    async getChannels() {
      const { data } = await this.youtubeDataApi.getChannels({
        part: "id",
        forHandle: this.handle,
      });
      return data;
    },
    async getChannelIds() {
      const channels = await this.getChannels();
      if (!channels.items) {
        throw new Error(`A channel for handle "${this.handle}" was not found`);
      }
      const channelIds = channels.items.map(({ id }) => id);
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
