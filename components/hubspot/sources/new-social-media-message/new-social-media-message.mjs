import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-social-media-message",
  name: "New Social Media Message",
  description: "Emit new event when a message is posted from HubSpot to the specified social media channel. Note: Only available for Marketing Hub Enterprise accounts",
  version: "0.0.27",
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
  methods: {
    ...common.methods,
    getTs(message) {
      return message.createdAt;
    },
    generateMeta(message) {
      const {
        broadcastGuid: id,
        messageText: summary,
      } = message;
      const ts = this.getTs(message);
      return {
        id,
        summary,
        ts,
      };
    },
    isRelevant(message, createdAfter) {
      return this.getTs(message) > createdAfter;
    },
    getParams(after) {
      return {
        params: {
          withChannelKeys: this.channel,
          since: after,
        },
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
  sampleEmit,
};
