import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tinko-chat-created-instant",
  name: "New Chat Created (Instant)",
  description: "Emit new event when a new chat is opened in Tinko. [See the documentation](https://docs.tinko.com.br/webhook/eventos-suportados/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "CHAT_CREATED",
      ];
    },
    getSummary(data) {
      return `New chat with ${this.contactLabel(data)}`;
    },
  },
  sampleEmit,
};
