import strava from "../../strava.app.mjs";

export default {
  name: "Get Stats",
  description: "Returns the activity stats of an athlete. Only includes data from activities set to Everyone visibilty. [See the docs](https://developers.strava.com/docs/reference/)",
  key: "strava-get-stats",
  version: "0.0.1",
  type: "action",
  props: {
    strava,
  },
  async run({ $ }) {
    const athlete = await this.strava.getAuthenticatedAthlete({
      $,
    });
    const resp = await this.strava.getStats({
      $,
      athlete,
    });
    $.export("$summary", "The activity stats have been retrieved");
    return resp;
  },
};
