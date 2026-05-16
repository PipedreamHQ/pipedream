import app from "../../strava.app.mjs";

export default {
  key: "strava-get-activity",
  name: "Get Activity",
  description: "Fetch a single Strava activity by ID with full detail."
    + " Use **Search Activities** first to resolve an activity name to an `activityId`."
    + " Set `includeAllEfforts` to `true` to include all segment efforts (slower, larger response — leave false for most reads)."
    + " For sub-resources (comments, kudos, laps), use the dedicated tools: **Get Activity Comments**, **Get Activity Kudoers**, **Get Activity Laps**."
    + " [See the documentation](https://developers.strava.com/docs/reference/#api-Activities-getActivityById)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    activityId: {
      type: "string",
      label: "Activity ID",
      description: "The numeric ID of the activity. Use **Search Activities** to look up an ID by name.",
    },
    includeAllEfforts: {
      type: "boolean",
      label: "Include All Segment Efforts",
      description: "When true, the response includes all segment efforts for the activity. Default false (smaller, faster response).",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const activity = await this.app.getActivity({
      $,
      activityId: this.activityId,
      params: {
        include_all_efforts: this.includeAllEfforts,
      },
    });
    $.export("$summary", `Retrieved activity ${this.activityId}`);
    return activity;
  },
};
