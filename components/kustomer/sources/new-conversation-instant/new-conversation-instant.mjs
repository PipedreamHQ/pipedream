import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kustomer-new-conversation-instant",
  name: "New Conversation Created (Instant)",
  description: "Emit new event when a conversation is created in Kustomer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "kustomer.conversation.create",
      ];
    },
    getSummary(body) {
      return `New Conversation: ${body.data.attributes.name}`;
    },
  },
  sampleEmit,
};
