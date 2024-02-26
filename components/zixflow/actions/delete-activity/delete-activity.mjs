import zixflow from "../../zixflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zixflow-delete-activity",
  name: "Delete an Activity",
  description: "Deletes an existing activity or task from Zixflow. [See the documentation](https://api.zixflow.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zixflow,
    activityId: {
      propDefinition: [
        zixflow,
        "activityId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zixflow.removeTask({
      activityId: this.activityId,
    });

    $.export("$summary", `Successfully deleted activity with ID: ${this.activityId}`);
    return response;
  },
};
