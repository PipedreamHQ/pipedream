import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "slack_v2-new-private-channel-created",
  name: "New Private Channel Created",
  version: "0.0.{{ts}}",
  description: "Emit new event when a new private channel is created. [See the documentation](https://api.slack.com/methods/conversations.list)",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources(max) {
      const privateChannels = [];
      const params = {
        limit: 1000,
        types: "private_channel",
      };
      const lastTs = this._getLastTs();
      let maxTs = lastTs;

      do {
        const {
          channels, response_metadata: { next_cursor: nextCursor },
        } = await this.slack.conversationsList(params);
        if (!channels.length) {
          break;
        }
        for (const channel of channels) {
          const ts = channel.created;
          if (ts > lastTs) {
            privateChannels.push(channel);
            maxTs = Math.max(ts, maxTs);
          }
        }
        params.cursor = nextCursor;
      } while (params.cursor);

      this._setLastTs(maxTs);

      if (max && privateChannels.length > max) {
        privateChannels.length = max;
      }

      return privateChannels;
    },
    generateMeta(channel) {
      return {
        id: channel.id,
        summary: `New private channel created - ${channel.name}`,
        ts: channel.created,
      };
    },
  },
};
