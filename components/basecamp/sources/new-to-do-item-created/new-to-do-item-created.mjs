import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-to-do-item-created",
  name: "New To-Do Item Created (Instant)",
  description: "Emit new event when a to-do item is created. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#webhooks)",
  version: "0.0.8",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookTypes() {
      return [
        "Todo",
      ];
    },
    getAllowedEvents() {
      return [
        "todo_created",
      ];
    },
  },
};
