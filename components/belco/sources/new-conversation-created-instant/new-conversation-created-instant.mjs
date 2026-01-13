import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "belco-new-conversation-created-instant",
  name: "New Conversation Created (Instant)",
  description: "Emit new event for each new conversation created event",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.created",
      ];
    },
  },
  sampleEmit,
};
