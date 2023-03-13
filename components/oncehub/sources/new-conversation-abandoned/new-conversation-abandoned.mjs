import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "oncehub-new-conversation-abandoned",
  name: "New Conversation Abandoned (Instant)",
  description: "Emit new event when a website visitor stops interacting with a bot for more than 10 minutes. [See the docs](https://developers.oncehub.com/reference/create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHookParams() {
      return {
        name: "Pipedream New Conversation Abandoned Subscription",
        events: [
          "conversation.abandoned",
        ],
      };
    },
    generateMeta(conversation) {
      const ts = Date.parse(conversation.last_updated_time);
      return {
        id: `${conversation.id}${ts}`,
        summary: `Conversation ID ${conversation.id} abandoned`,
        ts,
      };
    },
  },
};
