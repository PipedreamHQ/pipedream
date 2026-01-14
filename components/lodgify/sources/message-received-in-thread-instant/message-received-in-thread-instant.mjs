import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lodgify-message-received-in-thread-instant",
  name: "Message Received In Thread (Instant)",
  description: "Emit new event when a new guest message is received in a thread.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "guest_message_received";
    },
    generateMeta(body) {
      return {
        id: body.message_id,
        summary: `Message received in thread: ${body.message_id}`,
        ts: Date.parse(body.creation_time),
      };
    },
  },
  sampleEmit,
};
