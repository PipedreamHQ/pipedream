import strava from "../../strava.app.js";

export default {
  name: "Get Activity By ID",
  description: "Returns the given activity that is owned by the authenticated athlete. See `https://developers.strava.com/docs/reference/`",
  key: "strava-get-activity-by-id",
  version: "0.0.1",
  type: "action",
  props: {
    strava,
    activityId: {
      type: "integer",
      label: "ID of the activity",
      description: "ID of the activity",
    },
    include_all_efforts: {
      type: "boolean",
      label: "With segment efforts",
      description: "Set true to include all segments efforts",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      activityId: this.activityId,
      include_all_efforts: this.include_all_efforts,
    };
    const resp = await this.strava.getActivityById($, data);
    $.export("$summary", "The activity has been retrieved");
    return resp;
  },
};
