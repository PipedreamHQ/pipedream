import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-conversation-lifecycle-event",
  name: "New Conversation Lifecycle Event (Instant)",
  description: "Emit new event when the status of a conversation is changed. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Conversation Lifecycle Event Subscription",
        events: [
          "conversation.closed",
        ],
      };
    },
    generateMeta(conversation) {
      const ts = Date.parse(conversation.last_updated_time);
      return {
        id: `${conversation.id}${ts}`,
        summary: `Conversation ID ${conversation.id} status updated`,
        ts,
      };
    },
  },
};
