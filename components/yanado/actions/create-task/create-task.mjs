import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-create-task",
  name: "Create Task",
  description: "Create a new task. [See the docs](https://api.yanado.com/docs/?javascript#create-task)",
  version: "0.0.1",
  type: "action",
  props: {
    yanado,
    listId: {
      propDefinition: [
        yanado,
        "listId",
      ],
    },
    name: {
      type: "string",
      label: "Task Name",
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
  },
  async run({ $ }) {
    const response = await this.yanado.createTask({
      $,
      data: {
        listId: this.listId,
        name: this.name,
        statusId: this.statusId,
        assigneeId: this.assigneeId,
        description: this.description,
        dueDate: this.dueDate,
      },
    });
    $.export("$summary", "Successfully created task");
    return response;
  },
};
