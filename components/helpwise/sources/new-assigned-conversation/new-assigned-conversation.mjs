import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "helpwise-new-assigned-conversation",
  name: "New Assigned Conversation",
  description: "Emit new event when you become the assignee on a conversation you are watching. [See the documentation](https://documenter.getpostman.com/view/29744652/2s9YC5yYKf#15b25c72-1875-4389-8507-162f35aa7c52)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldData() {
      return "threads";
    },
    getFunction() {
      return this.helpwise.getConversations;
    },
    getSummary(item) {
      return `New Assigned Conversation: ${item.id}`;
    },
    getParams() {
      return {
        labelId: 0,
      };
    },
  },
  sampleEmit,
};
