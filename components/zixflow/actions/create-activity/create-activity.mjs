import zixflow from "../../zixflow.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zixflow-create-activity",
  name: "Create Activity",
  description: "Creates a new activity or task within Zixflow. [See the documentation](https://api.zixflow.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    zixflow,
    taskTitle: {
      propDefinition: [
        zixflow,
        "taskTitle",
      ],
    },
    taskDescription: {
      propDefinition: [
        zixflow,
        "taskDescription",
      ],
    },
    dueDate: {
      propDefinition: [
        zixflow,
        "dueDate",
        (c) => ({
          optional: c.dueDate
            ? false
            : true,
        }),
      ],
      optional: true,
    },
    assignedMembers: {
      propDefinition: [
        zixflow,
        "assignedMembers",
        (c) => ({
          optional: c.assignedMembers
            ? false
            : true,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zixflow.createTask({
      taskTitle: this.taskTitle,
      taskDescription: this.taskDescription,
      dueDate: this.dueDate,
      assignedMembers: this.assignedMembers,
    });

    $.export("$summary", `Successfully created activity with title '${this.taskTitle}'`);
    return response;
  },
};
