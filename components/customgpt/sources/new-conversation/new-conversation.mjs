import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "customgpt-new-conversation",
  name: "New Conversation",
  description: "Emit new event when a new conversation is created. [See the documentation](https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-conversations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.customgpt.listConversations;
    },
    getSummary(item) {
      return `New Conversation: ${item.id}`;
    },
  },
  sampleEmit,
};
