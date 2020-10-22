const asana = require("../../asana.app.js");

module.exports = {
  name: "Team Added To Organization",
  key: "asana-new-team",
  description: "Emits an event for each team added to an organization.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    asana,
    organizationId: { propDefinition: [asana, "organizationId"] },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let results = await this.asana.getTeams(this.organizationId);
    for (const result of results) {
      let team = await this.asana.getTeam(result.gid);
      this.$emit(team, {
        id: team.gid,
        summary: team.name,
        ts: Date.now(),
      });
    }
  },
};
