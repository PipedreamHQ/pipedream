import height from "../../height.app.mjs";

export default {
  key: "height-update-task",
  name: "Update Task",
  description: "Updates a specified task or tasks within your workspace.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    height,
    taskId: {
      propDefinition: [
        height,
        "taskId",
      ],
    },
    newTaskName: {
      propDefinition: [
        height,
        "newTaskName",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        height,
        "description",
      ],
      optional: true,
    },
    deadline: {
      propDefinition: [
        height,
        "deadline",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        height,
        "priority",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    await this.height.updateTask(
      this.taskId,
      this.newTaskName,
      this.description,
      this.deadline,
      this.priority,
    );
    $.export("$summary", `Task ${this.taskId} updated successfully`);
  },
};
