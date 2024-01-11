import microsoftTodo from "../../microsofttodo.app.mjs";

export default {
  key: "microsofttodo-list-tasks",
  name: "List Tasks",
  description: "List tasks in Microsoft To Do. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todotasklist-list-tasks).",
  version: "0.0.1",
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

    if (response) {
      $.export("$summary", "Successfully listed tasks");
    }

    return response;
  },
};
