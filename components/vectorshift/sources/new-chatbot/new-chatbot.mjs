import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "vectorshift-new-chatbot",
  name: "New Chatbot Created",
  description: "Emit new event when a chatbot is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listChatbots;
    },
    getSummary(item) {
      return `New Chatbot: ${item.name || item._id}`;
    },
  },
  sampleEmit,
};
