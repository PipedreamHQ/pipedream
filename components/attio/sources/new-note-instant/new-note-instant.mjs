import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-new-note-instant",
  name: "New Note (Instant)",
  description: "Emit new event when a new note is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "note.created";
    },
    generateMeta(note) {
      return {
        id: note.id.note_id,
        summary: `New Note with ID: ${note.id.note_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
