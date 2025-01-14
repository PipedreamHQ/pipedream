import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dixa-new-message-added-instant",
  name: "New Message Added to Conversation (Instant)",
  description: "Emit new event when a new message is added to a conversation.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "ConversationMessageAdded",
      ];
    },
    getSummary({ data }) {
      return `New message in conversation ${data.conversation.csid}`;
    },
  },
  sampleEmit,
};
