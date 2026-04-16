import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "belco-conversation-assigned-instant",
  name: "Conversation Assigned (Instant)",
  description: "Emit new event for each new conversation assigned event",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.assigned",
      ];
    },
  },
  sampleEmit,
};
