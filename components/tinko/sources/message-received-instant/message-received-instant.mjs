import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tinko-message-received-instant",
  name: "New Message Received (Instant)",
  description: "Emit new event when a contact sends a message to one of your Tinko channels. [See the documentation](https://docs.tinko.com.br/webhook/eventos-suportados/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "MESSAGE_RECEIVED",
      ];
    },
    getSummary(data) {
      const content = data.message?.content
        ? `: ${data.message.content.slice(0, 50)}`
        : ` (${data.message?.type ?? "message"})`;
      return `New message from ${this.contactLabel(data)}${content}`;
    },
  },
  sampleEmit,
};
