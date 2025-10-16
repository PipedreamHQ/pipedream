import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-channel-message",
  name: "New Channel Message",
  description: "Emit new event when a new message is posted in a channel. [See the documentation](https://learn.microsoft.com/en-us/graph/api/channel-list-messages?view=graph-rest-1.0&tabs=http)",
  version: "0.0.12",
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
    getTsField() {
      return "lastModifiedDateTime";
    },
    async getResources(lastUpdated, tsField) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChannelMessages,
        {
          teamId: this.team,
          channelId: this.channel,
        },
        lastUpdated,
        tsField,
        true, // Sorted by last modified date
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
