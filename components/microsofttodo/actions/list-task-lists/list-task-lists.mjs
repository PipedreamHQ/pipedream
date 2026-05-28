import microsoftTodo from "../../microsofttodo.app.mjs";

export default {
  key: "microsofttodo-list-task-lists",
  name: "List Task Lists",
  description: "List task lists in Microsoft To Do. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todo-list-lists).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTodo,
    skip: {
      type: "integer",
      label: "Skip",
      description: "The number of items to skip",
      optional: true,
    },
    top: {
      type: "integer",
      label: "Top",
      description: "The number of items to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftTodo.listLists({
      $,
      params: {
        $skip: this.skip,
        $top: this.top,
      },
    });

    $.export("$summary", `Successfully listed ${response.value.length} task list${response.value.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
