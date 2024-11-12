import common from "../common/base.mjs";

export default {
  ...common,
  key: "insertchat-new-ai-chatbot",
  name: "New AI Chatbot",
  description: "Emit new event when a new AI chatbot is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.insertchat.listChatbots;
    },
    getSummary(item) {
      return `New Chatbot ID: ${item.uid}`;
    },
  },
};
