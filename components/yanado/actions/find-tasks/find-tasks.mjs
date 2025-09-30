import yanado from "../../yanado.app.mjs";

export default {
  key: "yanado-find-tasks",
  name: "Find Tasks",
  description: "Find tasks in a list. [See the docs](https://api.yanado.com/docs/?javascript#tasks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    assignee: {
      propDefinition: [
        yanado,
        "assigneeId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      description: "Filter by assignee",
    },
    statusId: {
      propDefinition: [
        yanado,
        "statusId",
        (c) => ({
          listId: c.listId,
        }),
      ],
      description: "Filter by status",
    },
  },
  async run({ $ }) {
    const tasks = await this.yanado.findTasks({
      $,
      params: {
        listId: this.listId,
        assignee: this.assignee,
        statusId: this.statusId,
      },
    });
    const suffix = tasks.length === 1
      ? ""
      : "s";
    $.export("$summary", `Found ${tasks.length} task${suffix}`);
    return tasks;
  },
};
