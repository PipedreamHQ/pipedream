import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-player-stats",
  name: "Get Player Stats",
  description: "Get season stats for players in a league, optionally filtered by position. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#player-collection)",
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
    league: {
      propDefinition: [
        yfs,
        "league",
      ],
    },
    position: {
      type: "string",
      label: "Position",
      description: "Filter by position, e.g. `QB`, `RB`, `WR`. Leave blank for all positions",
      optional: true,
    },
  },
  async run({ $ }) {
    const players = await this.yfs.getPlayerStats(this.league, this.position, $);
    $.export("$summary", `Retrieved stats for ${players.length} players`);
    return players;
  },
};
