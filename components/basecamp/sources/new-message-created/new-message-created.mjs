import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "basecamp-new-message-created",
  name: "New Message Created (Instant)",
  description: "Emit new event when a message is created. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/webhooks.md#create-a-webhook)",
  version: "0.0.7",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookTypes() {
      return [
        "Message",
      ];
    },
    getAllowedEvents() {
      return [
        "message_created",
      ];
    },
  },
};
