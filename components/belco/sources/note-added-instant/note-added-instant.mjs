import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "belco-note-added-instant",
  name: "Note Added (Instant)",
  description: "Emit new event for each new note added event",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "conversation.note.added",
      ];
    },
  },
  sampleEmit,
};
