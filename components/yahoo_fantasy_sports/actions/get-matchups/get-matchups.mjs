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
  props: {
    yfs,
    teamKey: {
      type: "string",
      label: "Team Key",
      description: "The team key, e.g. `414.l.12345.t.1`",
    },
    week: {
      type: "string",
      label: "Week",
      description: "Week number for the matchups (defaults to the current week)",
      optional: true,
    },
  },
  async run({ $ }) {
    const matchups = await this.yfs.getTeamMatchups(this.teamKey, this.week, $);
    $.export("$summary", `Retrieved ${matchups.length} matchups`);
    return matchups;
  },
};
