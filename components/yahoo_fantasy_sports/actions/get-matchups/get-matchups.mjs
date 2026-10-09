import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-matchups",
  name: "Get Matchups",
  description: "Get head-to-head matchup results and projections for a team for a given week. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#matchups-resource)",
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
    const matchups = await this.yfs.getTeamMatchups(this.teamKey, this.week, $);
    $.export("$summary", `Retrieved ${matchups.length} matchups`);
    return matchups;
  },
};
