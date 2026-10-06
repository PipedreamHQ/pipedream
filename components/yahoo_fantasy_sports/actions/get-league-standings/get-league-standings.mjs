import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-league-standings",
  name: "Get League Standings",
  description: "Get team records, points for/against, and rank for a league. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#standings-resource)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    yfs,
    league: {
      propDefinition: [
        yfs,
        "league",
      ],
    },
  },
  async run({ $ }) {
    const teams = await this.yfs.getLeagueStandings(this.league, $);
    $.export("$summary", `Retrieved standings for ${teams.length} teams`);
    return teams;
  },
};
