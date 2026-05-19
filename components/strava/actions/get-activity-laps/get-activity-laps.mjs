import app from "../../strava.app.mjs";

export default {
  key: "strava-get-activity-laps",
  name: "Get Activity Laps",
  description: "Return the lap-level breakdown for a Strava activity (split times, distances, average speeds, heart rate per lap)."
    + " Use **Search Activities** first to resolve a name to an `activityId`."
    + " Note: manually-created activities and some sport types may have no laps; the response will be an empty array in that case (not an error)."
    + " Returns `{ laps, _rateLimitUsage }` — `_rateLimitUsage` includes Strava's `X-RateLimit-Usage` and `X-ReadRateLimit-Usage` so flows can observe approach to the rate-limit cap."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Activities-getLapsByActivityId)",
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
      data: laps,
      _rateLimitUsage,
    } = await this.app.getActivityLaps({
      $,
      activityId: this.activityId,
    });
    const count = Array.isArray(laps)
      ? laps.length
      : 0;
    $.export("$summary", `Retrieved ${count} lap${count === 1
      ? ""
      : "s"}`);
    return {
      laps: laps ?? [],
      _rateLimitUsage,
    };
  },
};
