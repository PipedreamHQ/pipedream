import common from "../common/webhook.mjs";
import scopes from "../common/scopes.mjs";

export default {
  ...common,
  key: "companycam-todo-list-completed",
  name: "Todo List Completed (Instant)",
  description: "Emit new event when a todo list is completed. [See the docs](https://docs.companycam.com/docs/webhooks-1).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getScopes() {
      return [
        scopes.TODO_LIST_COMPLETED,
      ];
    },
    generateMeta(resource) {
      const { payload } = resource;
      return {
        id: payload.todo_list.id,
        summary: `Todo List Completed: ${payload.todo_list.name}`,
        ts: resource.created_at,
      };
    },
  },
};
