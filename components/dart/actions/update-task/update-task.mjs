import dart from "../../dart.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dart-update-task",
  name: "Update Task",
  description: "Updates an existing task within a dartboard.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dart,
    taskId: {
      propDefinition: [
        dart,
        "taskId",
      ],
    },
    newTaskName: {
      propDefinition: [
        dart,
        "newTaskName",
      ],
      optional: true,
    },
    newDescription: {
      propDefinition: [
        dart,
        "newDescription",
      ],
      optional: true,
    },
    newDueDate: {
      propDefinition: [
        dart,
        "newDueDate",
      ],
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        dart,
        "assignedTo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const updateData = {};
    if (this.newTaskName) updateData.name = this.newTaskName;
    if (this.newDescription) updateData.description = this.newDescription;
    if (this.newDueDate) updateData.dueDate = this.newDueDate;
    if (this.assignedTo) updateData.assignedTo = this.assignedTo;

    const response = await this.dart.updateTask({
      taskId: this.taskId,
      ...updateData,
    });

    $.export("$summary", `Successfully updated task ${this.taskId}`);
    return response;
  },
};
