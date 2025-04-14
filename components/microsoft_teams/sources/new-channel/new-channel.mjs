import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-channel",
  name: "New Channel",
  description: "Emit new event when a new channel is created within a team",
  version: "0.0.10",
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
    async getResources(lastCreated) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listChannels,
        {
          teamId: this.team,
        },
        lastCreated,
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
