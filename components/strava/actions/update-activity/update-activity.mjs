import strava from "../../strava.app.mjs";

export default {
  name: "Update Activity",
  description: "Updates the given activity that is owned by the authenticated athlete. [See the docs](https://developers.strava.com/docs/reference/#api-Activities-updateActivityById)",
  key: "strava-update-activity",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    const resp = await this.strava.updateActivity({
      $,
      activityId: this.activityId,
      data: this.body,
    });
    $.export("$summary", "The activity has been updated");
    return resp;
  },
};
