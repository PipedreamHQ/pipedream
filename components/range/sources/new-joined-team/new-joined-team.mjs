import common from "../common/polling.mjs";

export default {
  ...common,
  key: "range-new-joined-team",
  name: "New Joined Team",
  description: "Emit new event when user joins a team. [See the docs](https://www.range.co/docs/api#rpc-list-teams).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.app,
        "userId",
      ],
    },
  },
  methods: {
    listTeams({
      userId, ...args
    } = {}) {
      return this.app.makeRequest({
        path: `/users/${userId}/teams`,
        ...args,
      });
    },
    generateMeta(resource) {
      return {
        id: resource.team_id,
        ts: resource.created_at,
        summary: `Joined Team ID ${resource.team_id}`,
      };
    },
  },
  async run() {
    const { teams } = await this.listTeams({
      userId: this.userId,
    });

    teams.forEach((resource) =>
      this.$emit(resource, this.generateMeta(resource)));
  },
};
