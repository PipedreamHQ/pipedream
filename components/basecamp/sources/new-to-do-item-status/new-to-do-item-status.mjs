import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-to-do-item-status",
  name: "To-Do Item Completed Or Uncompleted (Instant)",
  description: "Emit new event when a to-do item's status changes. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#webhooks)",
  version: "0.0.9",
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
