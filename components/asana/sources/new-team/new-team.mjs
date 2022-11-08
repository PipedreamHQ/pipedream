import asana from "../../asana.app.mjs";

export default {
  key: "asana-new-team",
  type: "source",
  name: "New Team",
  description: "Emit new event for each task added to an organization.",
  version: "0.1.2",
  dedupe: "unique",
  props: {
    asana,
    organization: {
      label: "Organization",
      description: "Gid of a organization.",
      type: "string",
      propDefinition: [
        asana,
        "organizations",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },

  async run() {
    const teams = await this.asana.getTeams(this.organization);

    for (let team of teams) {
      team = await this.asana.getTeam(team.gid);

      this.$emit(team, {
        id: team.gid,
        summary: team.name,
        ts: Date.now(),
      });
    }
  },
};
