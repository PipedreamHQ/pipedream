import base from "../common/base.mjs";

export default {
  ...base,
  key: "microsoft_teams-new-team-member",
  name: "New Team Member",
  description: "Emit new event when a new member is added to a team",
  version: "0.0.11",
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
    async getResources() {
      return this.getNewPaginatedResources(
        this.microsoftTeams.listTeamMembers,
        {
          teamId: this.team,
        },
      );
    },
    generateMeta(member) {
      return {
        id: member.userId,
        summary: member.displayName,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const resources = await this.getResources();
    for (const resource of resources) {
      const meta = this.generateMeta(resource);
      this.$emit(resource, meta);
    }
  },
};
