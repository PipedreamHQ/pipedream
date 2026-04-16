import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-team",
  name: "New Team",
  description: "Emit new event when a new team is joined by the authenticated user. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-joinedteams?view=graph-rest-1.0&tabs=http)",
  version: "0.0.15",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    async getResources(lastCreated, tsField) {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listTeams,
        {},
        lastCreated,
        tsField,
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
