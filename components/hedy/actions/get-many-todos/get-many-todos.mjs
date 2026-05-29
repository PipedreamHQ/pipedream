import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-many-todos",
  name: "Get Many Todos",
  description: "Retrieves a paginated list of action items (todos) across all Hedy sessions."
    + " Each item includes the todo text, completion status, optional due date, and the session it came from."
    + " To get todos for a specific session only, use **Get Todos By Session**."
    + " Use **Get Todo** with a specific todo ID to fetch a single item's full detail."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Todos/get_todos)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    after: {
      propDefinition: [
        app,
        "after",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listTodos({
      $,
      params: {
        limit: this.limit,
        after: this.after,
      },
    });
    const todos = response?.data || [];
    $.export("$summary", `Retrieved ${todos.length} todo${todos.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
