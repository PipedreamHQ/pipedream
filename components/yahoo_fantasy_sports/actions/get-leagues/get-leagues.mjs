import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-leagues",
  name: "Get Leagues",
  description: "List the fantasy leagues tied to the authenticated Yahoo account for a given game and season. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#leagues-collection)",
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
    gameKey: {
      type: "string",
      label: "Game Key",
      description: "Yahoo game key, e.g. `nfl` for NFL football",
      default: "nfl",
    },
    season: {
      type: "string",
      label: "Season",
      description: "Season game key, e.g. `414` for the 2023 NFL season. Each Yahoo season is a separate game — find the key for a past season in the Yahoo Fantasy Sports API docs. Leave blank for the current season",
      optional: true,
    },
  },
  async run({ $ }) {
    const leagues = await this.yfs.getLeagues(this.gameKey, this.season, $);
    const seasonLabel = this.season || this.gameKey;
    $.export("$summary", `Retrieved ${leagues.length} leagues for ${seasonLabel}`);
    return leagues;
  },
};
