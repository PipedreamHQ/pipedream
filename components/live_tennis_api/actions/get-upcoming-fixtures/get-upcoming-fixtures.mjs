import app from "../../live_tennis_api.app.mjs";

export default {
  key: "live_tennis_api-get-upcoming-fixtures",
  name: "Get Upcoming Fixtures",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List upcoming scheduled fixtures, earliest first, with tournament, round and start time. Set `tour` to restrict results to one tour. `start_time`, `player1_id` and `player2_id` may be null — a date-only fixture and an unresolved participant are real states (player names are always present). For matches already in play, use **Get Live Matches**. [See the documentation](https://docs.livetennisapi.com/reference.html)",
  type: "action",
  props: {
    app,
    tour: {
      propDefinition: [
        app,
        "tour",
      ],
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
      app, tour, limit,
    } = this;

    const response = await app.listFixtures({
      $,
      params: {
        tour,
        limit,
      },
    });

    const fixtures = response?.data ?? [];
    $.export("$summary", `Found ${fixtures.length} upcoming ${fixtures.length === 1
      ? "fixture"
      : "fixtures"}`);
    return fixtures;
  },
};
