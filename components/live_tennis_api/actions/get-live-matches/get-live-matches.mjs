import app from "../../live_tennis_api.app.mjs";

export default {
  key: "live_tennis_api-get-live-matches",
  name: "Get Live Matches",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "List matches currently in play, with the latest score for each. Covers ATP, WTA, Challenger, ITF and juniors; set `tour` to restrict results to one tour. Live data changes between requests as points are played, so re-fetch rather than cache. Each match's `id` is the `matchId` the other match endpoints take. For scheduled matches that have not started yet, use **Get Upcoming Fixtures**. [See the documentation](https://docs.livetennisapi.com/reference.html)",
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

    const response = await app.listMatches({
      $,
      params: {
        status: "live",
        tour,
        limit,
      },
    });

    const matches = response?.data ?? [];
    $.export("$summary", `Found ${matches.length} live ${matches.length === 1
      ? "match"
      : "matches"}`);
    return matches;
  },
};
