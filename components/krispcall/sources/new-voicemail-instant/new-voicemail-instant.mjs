import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "krispcall-new-voicemail-instant",
  name: "New Voicemail (Instant)",
  description: "Emit new event when a new voicemail is sent.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getAction() {
      return "new_voicemail";
    },
    getSummary() {
      return "New Voicemail";
    },
  },
  sampleEmit,
};
