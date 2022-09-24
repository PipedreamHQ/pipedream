import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-social-media-message",
  name: "New Social Media Message",
  description: `Emit new event when a message is posted from HubSpot to the specified
    social media channel`,
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    channel: {
      propDefinition: [
        common.props.hubspot,
        "channel",
      ],
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(message) {
      const {
        broadcastGuid: id,
        messageText: summary,
        createdAt: ts,
      } = message;
      return {
        id,
        summary,
        ts,
      };
    },
    isRelevant(message, createdAfter) {
      return message.createdAt > createdAfter;
    },
    getParams(after) {
      return {
        withChannelKeys: this.channel,
        since: after,
      };
    },
    async processResults(after, params) {
      await this.paginateUsingHasMore(
        params,
        this.hubspot.getBroadcastMessages.bind(this),
        null,
        after,
      );
    },
  },
};
