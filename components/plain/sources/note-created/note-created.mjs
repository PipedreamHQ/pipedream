import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-note-created",
  name: "Note Created",
  description: "Emit new event when a note is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.note_created";
    },
    getSummary({ payload }) {
      return `Note Created ID ${payload.note.id}`;
    },
  },
  sampleEmit,
};
