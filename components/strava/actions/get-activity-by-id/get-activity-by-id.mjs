import strava from "../../strava.app.mjs";

export default {
  name: "Get Activity By ID",
  description: "Returns the given activity that is owned by the authenticated athlete. [See the docs](https://developers.strava.com/docs/reference/#api-Activities-getActivityById)",
  key: "strava-get-activity-by-id",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const resp = await this.strava.getActivity({
      $,
      activityId: this.activityId,
      params: {
        include_all_efforts: this.include_all_efforts,
      },
    });
    $.export("$summary", "The activity has been retrieved");
    return resp;
  },
};
