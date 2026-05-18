import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-todos-by-session",
  name: "Get Todos By Session",
  description: "Retrieves all action items (todos) for a specific Hedy session."
    + " Use **Get Many Sessions** first to find the session ID."
    + " Each result includes the todo text, completion status, and optional due date."
    + " Use **Get Todo** with the session ID and todo ID for single-item detail."
    + " [See the documentation](https://www.hedy.ai/help/hedy-api/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
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
    const params = {};
    if (this.limit) params.limit = this.limit;
    if (this.after) params.after = this.after;

    const response = await this.app.getTodosBySession({
      $,
      sessionId: this.sessionId,
      params,
    });
    const todos = response?.data || [];
    $.export("$summary", `Retrieved ${todos.length} todo${todos.length === 1
      ? ""
      : "s"} for session ${this.sessionId}`);
    return response;
  },
};
