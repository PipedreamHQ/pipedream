import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-to-do-item-status",
  name: "New To-Do Item Status (Instant)",
  description: "Emit new event when a to-do item status changes. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#create-a-webhook)",
  version: "0.0.7",
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
        "todo_completed",
        "todo_uncompleted",
      ];
    },
  },
};
