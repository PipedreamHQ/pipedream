import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-conversation-started",
  name: "New Conversation Started (Instant)",
  description: "Emit new event when a website visitor starts interacting with a chatbot. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Conversation Started Subscription",
        events: [
          "conversation.started",
        ],
      };
    },
    generateMeta(conversation) {
      return {
        id: conversation.id,
        summary: `Conversation ID ${conversation.id} started`,
        ts: Date.parse(conversation.last_updated_time),
      };
    },
  },
};
