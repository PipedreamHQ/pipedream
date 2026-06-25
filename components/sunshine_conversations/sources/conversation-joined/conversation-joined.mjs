import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "sunshine_conversations-conversation-joined",
  name: "Conversation Joined (Instant)",
  description: "Emit new event when a conversation is joined. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Webhooks/operation/CreateWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "conversation.join",
      ];
    },
  },
};
