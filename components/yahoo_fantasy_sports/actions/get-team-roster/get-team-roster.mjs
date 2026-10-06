import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-team-roster",
  name: "Get Team Roster",
  description: "Get the current roster for a team, including starters vs. bench, injury/status tags, and position eligibility. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#roster-resource)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    yfs,
    teamKey: {
      propDefinition: [
        yfs,
        "teamKey",
      ],
    },
    week: {
      propDefinition: [
        yfs,
        "week",
      ],
    },
  },
  async run({ $ }) {
    const players = await this.yfs.getTeamRoster(this.teamKey, this.week, $);
    $.export("$summary", `Retrieved ${players.length} players on the roster`);
    return players;
  },
};
