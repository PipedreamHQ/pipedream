import zixflow from "../../zixflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zixflow-update-activity",
  name: "Update Activity",
  description: "Updates an existing activity or task in Zixflow. [See the documentation](https://api.zixflow.com/docs)",
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
    taskTitle: {
      propDefinition: [
        zixflow,
        "taskTitle",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
    taskDescription: {
      propDefinition: [
        zixflow,
        "taskDescription",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
    dueDate: {
      propDefinition: [
        zixflow,
        "dueDate",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
    assignedMembers: {
      propDefinition: [
        zixflow,
        "assignedMembers",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zixflow.updateTask({
      activityId: this.activityId,
      taskTitle: this.taskTitle,
      taskDescription: this.taskDescription,
      dueDate: this.dueDate,
      assignedMembers: this.assignedMembers,
    });

    $.export("$summary", `Successfully updated activity with ID ${this.activityId}`);
    return response;
  },
};
