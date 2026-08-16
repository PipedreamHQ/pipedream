import app from "../../live_tennis_api.app.mjs";

export default {
  key: "live_tennis_api-search-players",
  name: "Search Players",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Search players by name. Ranked players are returned first. [See the documentation](https://docs.livetennisapi.com/reference.html)",
  type: "action",
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "The player name (or part of it) to search for. Omit to list players, ranked first.",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, search, limit,
    } = this;

    const response = await app.searchPlayers({
      $,
      params: {
        search,
        limit,
      },
    });

    const players = response?.data ?? [];
    $.export("$summary", `Found ${players.length} ${players.length === 1
      ? "player"
      : "players"}`);
    return players;
  },
};
