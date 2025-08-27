import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kustomer-updated-conversation-instant",
  name: "Updated Conversation (Instant)",
  description: "Emit new event when an existing conversation is updated in Kustomer.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "kustomer.conversation.update",
      ];
    },
    getSummary(body) {
      return `Conversation Updated: ${body.data.attributes.name}`;
    },
  },
  sampleEmit,
};
