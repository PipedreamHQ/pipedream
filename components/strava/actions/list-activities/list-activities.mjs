import strava from "../../strava.app.js";

export default {
  name: "Get Activity List",
  description: "Returns the activities of an athlete for a specific identifier. Requires activity:read. Only Me activities will be filtered out unless requested by a token with activity:read_all. See `https://developers.strava.com/docs/reference/`",
  key: "strava_get-activity-list",
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
    page: {
      type: "integer",
      label: " Page number",
      description: "Defaults to 1",
      optional: true,
    },
    per_page: {
      type: "integer",
      label: "Number of items per page",
      description: "Defaults to 30",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.before)
      data.before = this.before;
    if (this.after)
      data.after = this.after;
    if (this.page)
      data.page = this.page;
    if (this.per_page)
      data.per_page = this.per_page;
    const resp = await this.strava.listActivities($, data);
    $.export("$summary", "The activity list has been retrieved");
    return resp;
  },
};
