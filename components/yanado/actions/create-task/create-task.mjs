import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-create-task",
  name: "Create Task",
  description: "Create a new task. [See the docs](https://api.yanado.com/docs/?javascript#create-task)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      propDefinition: [
        yanado,
        "name",
      ],
      optional: false,
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
      optional: false,
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
