import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-note-updated-instant",
  name: "Note Updated (Instant)",
  description: "Emit new event when the title of a note is modified. Body updates do not currently trigger webhooks.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "note.updated";
    },
    generateMeta(note) {
      return {
        id: note.id.note_id,
        summary: `Updated Note with ID: ${note.id.note_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
