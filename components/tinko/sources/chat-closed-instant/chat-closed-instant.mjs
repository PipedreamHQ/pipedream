import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tinko-chat-closed-instant",
  name: "New Chat Closed (Instant)",
  description: "Emit new event when a chat is closed (finished) in Tinko. [See the documentation](https://docs.tinko.com.br/webhook/eventos-suportados/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "CHAT_ENDED",
      ];
    },
    getSummary(data) {
      return `Chat with ${this.contactLabel(data)} closed`;
    },
  },
  sampleEmit,
};
