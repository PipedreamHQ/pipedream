import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-update-task",
  name: "Update Task",
  description: "Update a new task. [See the docs](https://api.yanado.com/docs/?javascript#update-task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        yanado,
        "name",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        yanado,
        "description",
      ],
    },
    statusId: {
      propDefinition: [
        yanado,
        "statusId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    assigneeId: {
      propDefinition: [
        yanado,
        "assigneeId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    dueDate: {
      propDefinition: [
        yanado,
        "dueDate",
      ],
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
