import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "sunshine_conversations-conversation-left",
  name: "Conversation Left (Instant)",
  description: "Emit new event when a participant leaves a conversation. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Webhooks/operation/CreateWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "conversation:leave",
      ];
    },
  },
};
