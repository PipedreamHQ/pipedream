import app from "../../zixflow.app.mjs";

export default {
  key: "zixflow-delete-activity",
  name: "Delete Activity",
  description: "Deletes an existing activity or task from Zixflow. [See the documentation](https://docs.zixflow.com/api-reference/activity-list/delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    activityId: {
      propDefinition: [
        app,
        "activityId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteActivity({
      $,
      activityId: this.activityId,
    });

    $.export("$summary", `Successfully deleted activity with ID: ${this.activityId}`);
    return response;
  },
};
