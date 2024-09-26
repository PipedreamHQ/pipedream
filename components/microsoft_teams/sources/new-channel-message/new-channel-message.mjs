import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-channel-message",
  name: "New Channel Message",
  description: "Emit new event when a new message is posted in a channel",
  version: "0.0.7",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    team: {
      propDefinition: [
        base.props.microsoftTeams,
        "team",
      ],
    },
    channel: {
      propDefinition: [
        base.props.microsoftTeams,
        "channel",
        (c) => ({
          teamId: c.team,
        }),
      ],
    },
  },
  methods: {
    ...base.methods,
    async getResources(lastCreated) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChannelMessages,
        {
          teamId: this.team,
          channelId: this.channel,
        },
        lastCreated,
      );
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message ${message.id}`,
        ts: Date.parse(message.createdDateTime),
      };
    },
  },
};
