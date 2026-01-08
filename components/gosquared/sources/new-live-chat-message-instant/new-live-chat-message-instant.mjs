import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gosquared-new-live-chat-message-instant",
  name: "New Live Chat Message (Instant)",
  description: "Emit new event when a new live chat message is received in GoSquared.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "chat_message";
    },
    generateMeta(body) {
      return {
        id: body.message.id,
        summary: `New live chat message: ${body.message.id}`,
        ts: body.message.timestamp,
      };
    },
  },
  sampleEmit,
};

