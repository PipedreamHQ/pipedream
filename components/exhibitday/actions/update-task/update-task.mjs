import ExhibitDay from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-update-task",
  name: "Update Task",
  description: "Updates an existing task in ExhibitDay. [See the documentation](https://api.exhibitday.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ExhibitDay,
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to update",
    },
    taskName: {
      type: "string",
      label: "Task Name",
      description: "The new name of the task",
      optional: true,
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "The new assignee of the task",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The new due date of the task",
      optional: true,
    },
    taskStatus: {
      type: "string",
      label: "Task Status",
      description: "The new status of the task",
      optional: true,
    },
    taskDescription: {
      type: "string",
      label: "Task Description",
      description: "The new description of the task",
      optional: true,
    },
    taskComponent: {
      type: "string",
      label: "Task Component",
      description: "The new component of the task",
      optional: true,
    },
  },
  async run({ $ }) {
    const taskData = {
      taskName: this.taskName,
      assignee: this.assignee,
      dueDate: this.dueDate,
      taskStatus: this.taskStatus,
      taskDescription: this.taskDescription,
      taskComponent: this.taskComponent,
    };

    const response = await this.ExhibitDay.updateTask(this.taskId, taskData);

    $.export("$summary", `Successfully updated task ${this.taskId}`);
    return response;
  },
};
