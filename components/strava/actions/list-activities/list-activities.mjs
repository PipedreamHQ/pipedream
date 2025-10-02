import strava from "../../strava.app.mjs";

export default {
  name: "Get Activity List",
  description: "Returns the activities of an athlete for a specific identifier. [See the docs](https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities)",
  key: "strava-get-activity-list",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    strava,
    before: {
      type: "integer",
      label: "Before",
      description: "An epoch timestamp to use for filtering activities that have taken place before a certain time",
      optional: true,
    },
    after: {
      type: "integer",
      label: "After",
      description: "An epoch timestamp to use for filtering activities that have taken place after a certain time",
      optional: true,
    },
    maxItems: {
      type: "integer",
      label: "Max number of activities",
      description: "Maximum number of activities, if not given all activities are returned",
      optional: true,
    },
  },
  async run({ $ }) {
    const activities = [];
    const resourcesStream = await this.strava.getResourcesStream({
      resourceFn: this.strava.listActivities,
      resourceFnArgs: {
        $,
        params: {
          before: this.before,
          after: this.after,
          per_page: 100,
        },
      },
      maxItems: this.maxItems,
    });
    for await (const activity of resourcesStream) {
      activities.push(activity);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${activities.length} ${activities.length === 1 ? "activity" : "activities"}`);
    return activities;
  },
};
