import common from "../common/base-webhook.mjs";

export default {
  ...common,
  key: "sunshine_conversations-new-message-delivered-to-channel",
  name: "New Message Delivered to Channel (Instant)",
  description: "Emit new event when a new message is delivered to a channel. [See the documentation](https://developer.zendesk.com/api-reference/conversations/#tag/Webhooks/operation/CreateWebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "conversation:message:delivery:channel",
      ];
    },
  },
};
