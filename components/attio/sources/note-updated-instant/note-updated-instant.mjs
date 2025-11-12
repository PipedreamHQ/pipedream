import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-note-updated-instant",
  name: "New Note Updated (Instant)",
  description: "Emit new event when the title of a note is modified. Body updates do not currently trigger webhooks.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSubscriptions() {
      return [
        {
          event_type: "note.updated",
          filter: null,
        },
      ];
    },
    generateMeta(note) {
      const ts = Date.now();
      return {
        id: `${note.id.note_id}-${ts}`,
        summary: `Updated Note with ID: ${note.id.note_id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
