import strava from "../../strava.app.js";

export default {
  name: "Get Stats",
  description: "Returns the activity stats of an athlete. Only includes data from activities set to Everyone visibilty. See `https://developers.strava.com/docs/reference/`",
  key: "strava_get-stats",
  version: "0.0.1",
  type: "action",
  props: {
    strava,
    id: {
      type: "integer",
      label: "The identifier of the athlete",
      description: "Must match the authenticated athlete",
    },
  },
  async run({ $ }) {
    const data = {
      id: this.id,
    };
    const resp = await this.strava.getStats($, data);
    $.export("$summary", "The activity stats have been retrieved");
    return resp;
  },
};
