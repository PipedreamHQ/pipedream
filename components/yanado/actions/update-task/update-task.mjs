import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-update-task",
  name: "Update Task",
  description: "Update a new task. [See the docs](https://api.yanado.com/docs/?javascript#update-task)",
  version: "0.0.1",
  type: "action",
  props: {
    yanado,
    taskId: {
      propDefinition: [
        yanado,
        "taskId",
      ],
    },
    listId: {
      propDefinition: [
        yanado,
        "listId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Task Name",
      optional: true,
    },
    description: {
      type: "string",
      label: "Task Description",
      optional: true,
    },
    statusId: {
      propDefinition: [
        yanado,
        "statusId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        yanado,
        "assigneeId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Date in `YYYY-MM-DD` or `YYYY-MM-DDTHH-MM-SS` format",
      optional: true,
    },
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Choose if the task should be archived",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.yanado.updateTask({
      $,
      taskId: this.taskId,
      data: {
        listId: this.listId,
        name: this.name,
        statusId: this.statusId,
        assigneeId: this.assigneeId,
        description: this.description,
        dueDate: this.dueDate,
        archived: this.archived,
      },
    });
    $.export("$summary", "Successfully updated task");
    return response;
  },
};
