import microsoftTodo from "../../microsofttodo.app.mjs";

export default {
  key: "microsofttodo-create-list",
  name: "Create List",
  description: "Create a new task list in Microsoft To Do. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todo-post-lists).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    microsoftTodo,
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The name of the task list to create.",
    },
  },
  async run({ $ }) {
    const response = await this.microsoftTodo.createList({
      data: {
        displayName: this.displayName,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created task list with ID ${response.id}.`);
    }

    return response;
  },
};
