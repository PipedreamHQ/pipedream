import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "belco-conversation-closed-instant",
  name: "Conversation Closed (Instant)",
  description: "Emit new event for each new conversation closed event",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.closed",
      ];
    },
  },
  sampleEmit,
};
