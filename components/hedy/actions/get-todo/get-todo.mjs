import app from "../../hedy.app.mjs";

export default {
  key: "hedy-get-todo",
  name: "Get Todo",
  description: "Retrieves a single action item (todo) by its ID within a session, returning text, completion status, due date, and associated topic."
    + " Both the session ID and todo ID are required."
    + " Use **Get Todos By Session** first to list todos for a session and obtain todo IDs."
    + " [See the documentation](https://app.swaggerhub.com/apis-docs/HedyAI/hedy-api/1.5.2#/Todos/get_sessions__sessionId__todos__todoId_)",
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
    todoId: {
      propDefinition: [
        app,
        "todoId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTodo({
      $,
      sessionId: this.sessionId,
      todoId: this.todoId,
    });
    const todo = response?.data || response;
    $.export("$summary", `Retrieved todo: ${todo?.text
      ? todo.text.slice(0, 60)
      : this.todoId}`);
    return response;
  },
};
