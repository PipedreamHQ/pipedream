import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "aidbase-new-chatbot-knowledge-item",
  name: "New Chatbot Knowledge Item",
  description: "Emit new event when a new knowledge item is added to a chatbot.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    chatbotId: {
      propDefinition: [
        common.props.aidbase,
        "chatbotId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.aidbase.listChatbotKnowledgeItems;
    },
    getArgs() {
      return {
        chatbotId: this.chatbotId,
      };
    },
  },
  sampleEmit,
};
