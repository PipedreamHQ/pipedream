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
      propDefinition: [
        yfs,
        "position",
      ],
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
      description: "Maximum number of players to return (up to 25 per Yahoo API limits). Example: `10`",
      optional: true,
      default: 25,
    },
    start: {
      type: "integer",
      label: "Start",
      description: "Starting offset for pagination, e.g. `25` for the second page. Leave blank for the first page",
      optional: true,
    },
  },
  async run({ $ }) {
    const players = await this.yfs.getFreeAgents(this.league, {
      position: this.position,
      sort: this.sort,
      count: this.count,
      start: this.start,
    }, $);
    $.export("$summary", `Retrieved ${players.length} free agents`);
    return players;
  },
};
