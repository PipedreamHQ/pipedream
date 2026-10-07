import yfs from "../../yahoo_fantasy_sports.app.mjs";

export default {
  key: "yahoo_fantasy_sports-get-free-agents",
  name: "Get Free Agents",
  description: "List available free agent players in a league, with optional position filter and sorting. [See the documentation](https://developer.yahoo.com/fantasysports/guide/#player-collection)",
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
    sort: {
      type: "string",
      label: "Sort By",
      description: "Sort key accepted by the Yahoo API, e.g. `PTS` for fantasy points. Leave blank for the default order",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Maximum number of players to return (up to 25 per Yahoo API limits)",
      optional: true,
      default: 25,
    },
  },
  async run({ $ }) {
    const players = await this.yfs.getFreeAgents(this.league, {
      position: this.position,
      sort: this.sort,
      count: this.count,
    }, $);
    $.export("$summary", `Retrieved ${players.length} free agents`);
    return players;
  },
};
