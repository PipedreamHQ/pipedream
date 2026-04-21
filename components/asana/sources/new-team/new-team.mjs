import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import asana from "../../asana.app.mjs";

export default {
  key: "asana-new-team",
  type: "source",
  name: "New Team",
  description: "Emit new event for each team added to an organization.",
  version: "0.1.12",
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
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },

  async run() {
    const teams = await this.asana.getTeams(this.organization);

    for (const item of teams) {
      const { data: team } = await this.asana.getTeam({
        teamId: item.gid,
      });

      this.$emit(team, {
        id: team.gid,
        summary: team.name,
        ts: Date.now(),
      });
    }
  },
};
