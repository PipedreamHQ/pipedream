import common from "../common/base.mjs";

export default {
  ...common,
  key: "insertchat-new-chat-session",
  name: "New Chat Session",
  description: "Emit new event when a new chat session is initiated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    chatbotId: {
      propDefinition: [
        common.props.insertchat,
        "chatbotId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.insertchat.listChatSessions;
    },
    getArgs() {
      return {
        chatbotId: this.chatbotId,
      };
    },
    getSummary(item) {
      return `New Chat Session ID: ${item.uid}`;
    },
  },
};
