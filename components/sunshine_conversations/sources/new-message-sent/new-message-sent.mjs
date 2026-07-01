import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "sunshine_conversations-new-message-sent",
  name: "New Message Sent (Instant)",
  description: "Emit new event when a new message is sent in a conversation. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Webhooks/operation/CreateWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "conversation:message",
      ];
    },
  },
};
