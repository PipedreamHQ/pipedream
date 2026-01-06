import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-channel",
  name: "New Channel",
  description: "Emit new event when a new channel is created within a team. [See the documentation](https://learn.microsoft.com/en-us/graph/api/team-list-allchannels?view=graph-rest-1.0&tabs=http)",
  version: "0.0.14",
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
  },
  methods: {
    ...base.methods,
    async getResources(lastCreated, tsField) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChannels,
        {
          teamId: this.team,
        },
        lastCreated,
        tsField,
      );
    },
    generateMeta(channel) {
      return {
        id: channel.id,
        summary: channel.displayName,
        ts: Date.parse(channel.createdDateTime),
      };
    },
  },
};
