import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "attio-note-updated-instant",
  name: "New Note Updated (Instant)",
  description: "Emit new event when a note is updated. Fires when the title is modified (`note.updated`) and when the body content is edited (`note-content.updated`).",
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
        {
          event_type: "note-content.updated",
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
