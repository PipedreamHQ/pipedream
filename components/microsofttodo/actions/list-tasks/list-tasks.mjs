import microsoftTodo from "../../microsofttodo.app.mjs";

export default {
  key: "microsofttodo-list-tasks",
  name: "List Tasks",
  description: "List every task in a Microsoft To Do task list by following Microsoft Graph pagination. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todotasklist-list-tasks).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftTodo,
    taskListId: {
      propDefinition: [
        microsoftTodo,
        "taskListId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.microsoftTodo.listTasks({
      $,
      taskListId: this.taskListId,
    });

    const tasks = response?.value;

    if (tasks) {
      $.export("$summary", `Successfully listed ${tasks.length} task${tasks.length === 1
        ? ""
        : "s"}`);
    }

    return tasks;
  },
};
