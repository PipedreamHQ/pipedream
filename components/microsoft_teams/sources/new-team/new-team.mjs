import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-team",
  name: "New Team",
  description: "Emit new event when a new team is joined by the authenticated user",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
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
        this.microsoftTeams.listTeams,
        {},
        this.max,
        lastCreated,
      );
    },
    generateMeta(team) {
      return {
        id: team.id,
        summary: team.displayName,
        ts: Date.now(),
      };
    },
  },
};
