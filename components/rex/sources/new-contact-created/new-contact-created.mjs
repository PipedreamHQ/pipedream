import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rex-new-contact-created",
  name: "New Contact Created (Instant)",
  description: "Emit new event for each new contact created in Rex.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "contacts.created";
    },
    generateMeta(item) {
      const id = item.payload.context.record_id;
      return {
        id,
        summary: `New Contact ${id}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
  sampleEmit,
};
