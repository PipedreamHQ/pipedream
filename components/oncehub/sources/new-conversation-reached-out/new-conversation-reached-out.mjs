import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-conversation-reached-out",
  name: "New Conversation Reached Out (Instant)",
  description: "Emit new event when a chatbot reaches out to a website visitor. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Conversation Reached Out Subscription",
        events: [
          "conversation.reached_out",
        ],
      };
    },
    generateMeta(conversation) {
      const ts = Date.parse(conversation.last_updated_time);
      return {
        id: `${conversation.id}${ts}`,
        summary: `Conversation ID ${conversation.id} reached out`,
        ts,
      };
    },
  },
};
