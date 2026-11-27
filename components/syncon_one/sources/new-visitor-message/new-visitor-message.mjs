import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-new-visitor-message",
  name: "Visitor Message Received",
  description:
    "Emit new event when a visitor or customer sends a message. The conversation comes with its latest message, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "conversation.message_received";
    },
    getPath() {
      return "/conversations";
    },
    getIdKey() {
      return "conversationId";
    },
    isComposite() {
      return true;
    },
    getSummary() {
      return "Visitor Message Received";
    },
  },
};
