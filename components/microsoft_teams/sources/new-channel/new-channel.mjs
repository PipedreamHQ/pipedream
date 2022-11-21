import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-channel",
  name: "New Channel",
  description: "Emit new event when a new channel is created within a team",
  version: "0.0.2",
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
    max: {
      propDefinition: [
        base.props.microsoftTeams,
        "max",
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
        this.max,
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
