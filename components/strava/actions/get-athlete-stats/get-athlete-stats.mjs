import app from "../../strava.app.mjs";

export default {
  key: "strava-get-athlete-stats",
  name: "Get Athlete Stats",
  description: "Get the authenticated athlete's recent, year-to-date, and all-time stats — including totals for runs, rides, and swims."
    + " By default, resolves the authenticated athlete's ID automatically (no input needed). Pass `athleteId` to look up another athlete's publicly-visible stats instead."
    + " Stats only include activities the requesting user has permission to view. For private activities of another athlete, results will be limited."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Athletes-getStats)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    athleteId: {
      type: "string",
      label: "Athlete ID",
      description: "Optional. Defaults to the authenticated athlete's ID. Pass another athlete's ID to fetch their publicly-visible stats.",
      optional: true,
    },
  },
  async run({ $ }) {
    let athleteId = this.athleteId;
    if (!athleteId) {
      // Try the auth-derived ID first (cheap), fall back to /athlete lookup
      // if Pipedream's auth provision for Strava doesn't populate oauth_uid.
      athleteId = this.app._athleteId();
      if (!athleteId) {
        const me = await this.app.getAuthenticatedAthlete({
          $,
        });
        athleteId = String(me.id);
      }
    }
    const stats = await this.app.getStats({
      $,
      athleteId,
    });
    $.export("$summary", `Retrieved stats for athlete ${athleteId}`);
    return stats;
  },
};
