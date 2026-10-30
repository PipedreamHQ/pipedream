import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-conversation",
  name: "New Conversation",
  description: "Emit new event when a visitor or customer starts a conversation, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "conversation.created";
    },
    getPath() {
      return "/conversations";
    },
    getIdKey() {
      return "conversationId";
    },
    getSummary() {
      return "New Conversation";
    },
  },
};
