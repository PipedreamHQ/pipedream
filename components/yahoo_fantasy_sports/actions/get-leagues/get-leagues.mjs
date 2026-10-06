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
  props: {
    yfs,
    gameKey: {
      type: "string",
      label: "Game Key",
      description: "Yahoo game key, e.g. `nfl` for NFL football",
      default: "nfl",
    },
  },
  async run({ $ }) {
    const leagues = await this.yfs.getLeagues(this.gameKey, $);
    $.export("$summary", `Retrieved ${leagues.length} leagues for game ${this.gameKey}`);
    return leagues;
  },
};
