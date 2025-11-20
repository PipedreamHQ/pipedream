import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-team",
  name: "New Team",
  description: "Emit new event when the authenticated user is added to a new team. [See the documentation](https://docs.github.com/en/rest/teams/teams?apiVersion=20.2.61-28#list-teams-for-the-authenticated-user)",
  version: "0.2.6",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      return this.github.getTeams();
    },
    getItemMetadata(item) {
      return {
        summary: `New team: "${item.name ?? item.slug}"`,
        ts: Date.now(),
      };
    },
  },
};
