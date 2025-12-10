import common from "../common/base.mjs";

export default {
  ...common,
  key: "help_scout-new-note-created-instant",
  name: "New Note Created (Instant)",
  description: "Emit new event when a note is added to a conversation.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "convo.note.created",
      ];
    },
    getSummary(body) {
      return `New note created in conversation: ${body.subject}`;
    },
  },
};
