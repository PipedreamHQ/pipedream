import strava from "../../strava.app.js";

export default {
  name: "Update Activity",
  description: "Updates the given activity that is owned by the authenticated athlete. Requires activity:write. Also requires activity:read_all in order to update Only Me activities. See `https://developers.strava.com/docs/reference/`",
  key: "strava_update-activity",
  version: "0.0.2",
  type: "action",
  props: {
    strava,
    id: {
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
      id: this.id,
      ...this.body,
    };
    const resp = await this.strava.updateActivity($, data);
    $.export("$summary", "The activity has been updated");
    return resp;
  },
};
