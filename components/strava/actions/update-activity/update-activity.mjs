import strava from "../../strava.app.js";

export default {
  name: "Update Activity",
  description: "Updates the given activity that is owned by the authenticated athlete. See `https://developers.strava.com/docs/reference/`",
  key: "strava-update-activity",
  version: "0.0.1",
  type: "action",
  props: {
    strava,
    activityId: {
      type: "integer",
      label: "ID of the activity",
      description: "ID of the activity",
    },
    body: {
      type: "object",
      label: "Key-value object for fields to be updated",
      description: "Any valid key can be added into the object",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      activityId: this.activityId,
      ...this.body,
    };
    const resp = await this.strava.updateActivity($, data);
    $.export("$summary", "The activity has been updated");
    return resp;
  },
};
