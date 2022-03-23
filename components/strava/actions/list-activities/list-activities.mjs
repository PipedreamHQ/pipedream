import strava from "../../strava.app.js";

export default {
  name: "Get Activity List",
  description: "Returns the activities of an athlete for a specific identifier. See `https://developers.strava.com/docs/reference/`",
  key: "strava-get-activity-list",
  version: "0.0.1",
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
    const data = {
      before: this.before,
      after: this.after,
      maxItems: this.maxItems,
    };
    const resp = await this.strava.listActivities($, data);
    $.export("$summary", "The activity list has been retrieved");
    return resp;
  },
};
