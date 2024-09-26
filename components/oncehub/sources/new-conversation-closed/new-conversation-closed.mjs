import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-conversation-closed",
  name: "New Conversation Closed (Instant)",
  description: "Emit new event when a website visitor reaches the end of the conversation flow or starts a new conversation with a different chatbot. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Conversation Closed Subscription",
        events: [
          "conversation.closed",
        ],
      };
    },
    generateMeta(conversation) {
      const ts = Date.parse(conversation.last_updated_time);
      return {
        id: `${conversation.id}${ts}`,
        summary: `Conversation ID ${conversation.id} closed`,
        ts,
      };
    },
  },
};
