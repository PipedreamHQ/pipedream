import microsoftTodo from "../../microsofttodo.app.mjs";

export default {
  key: "microsofttodo-list-task-lists",
  name: "List Task Lists",
  description: "List task lists in Microsoft To Do, following Microsoft Graph pagination across all available pages unless the Top input limits the number returned. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todo-list-lists).",
  version: "0.0.2",
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
      description: "The number of task lists to skip before returning results, e.g. `20`.",
      optional: true,
    },
    top: {
      type: "integer",
      label: "Top",
      description: "The maximum total number of task lists to return, e.g. `100`. Leave blank to return every remaining list across all pages.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftTodo.listLists({
      $,
      maxItems: this.top,
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
