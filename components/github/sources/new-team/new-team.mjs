import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-team",
  name: "New Team",
  description: "Emit new events when the user is added to a new team",
  version: "0.1.17",
  type: "source",
  dedupe: "unique",
  async run() {
    const teams = await this.github.getTeams();

    teams.map((team) => {
      this.$emit(team, {
        id: team.id,
        summary: `New team ${team.id}`,
        ts: Date.parse(team.created_at),
      });
    });
  },
};
