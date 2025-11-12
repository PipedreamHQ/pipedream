import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-to-do-list-created",
  name: "New To-Do List Created (Instant)",
  description: "Emit new event when a to-do list is created. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#webhooks)",
  version: "0.0.9",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookTypes() {
      return [
        "Todolist",
      ];
    },
    getAllowedEvents() {
      return [
        "todolist_created",
      ];
    },
  },
};
