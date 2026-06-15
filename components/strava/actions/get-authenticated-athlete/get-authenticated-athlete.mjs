import app from "../../strava.app.mjs";

export default {
  key: "strava-get-authenticated-athlete",
  name: "Get Authenticated Athlete",
  description: "Identity tool for Strava — returns the currently authenticated athlete (summary representation including `id`, `firstname`, `lastname`, profile photo)."
    + " Use this whenever you need to know who the connected user is, or to surface the athlete ID for downstream tools."
    + " Note: a detailed athlete representation requires the `profile:read_all` scope, which is not configured for this connector. This tool returns the summary representation."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Athletes-getLoggedInAthlete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const athlete = await this.app.getAuthenticatedAthlete({
      $,
    });
    $.export("$summary", `Retrieved athlete ${athlete?.id ?? "(unknown id)"}`);
    return athlete;
  },
};
