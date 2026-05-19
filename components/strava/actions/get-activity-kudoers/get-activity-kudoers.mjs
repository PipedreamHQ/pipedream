import app from "../../strava.app.mjs";

export default {
  key: "strava-get-activity-kudoers",
  name: "Get Activity Kudoers",
  description: "Return the athletes who gave kudos to a Strava activity."
    + " Use **Search Activities** first to resolve a name to an `activityId`."
    + " Empty array if no one has kudosed the activity."
    + " Returns `{ kudoers, _rateLimitUsage }` — `_rateLimitUsage` exposes Strava's rate-limit headers for observability."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Activities-getKudoersByActivityId)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    activityId: {
      propDefinition: [
        app,
        "activityId",
      ],
    },
  },
  async run({ $ }) {
    const {
      data: kudoers,
      _rateLimitUsage,
    } = await this.app.getActivityKudoers({
      $,
      activityId: this.activityId,
    });
    const count = Array.isArray(kudoers)
      ? kudoers.length
      : 0;
    $.export("$summary", `Retrieved ${count} kudoer${count === 1
      ? ""
      : "s"}`);
    return {
      kudoers: kudoers ?? [],
      _rateLimitUsage,
    };
  },
};
