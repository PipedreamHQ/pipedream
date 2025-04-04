import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openphone-new-call-recording-completed-instant",
  name: "New Call Recording Completed (Instant)",
  description: "Emit new event when a call recording has finished.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "call.recording.completed",
      ];
    },
    getEmit(body) {
      return `New call recording completed for call ID: ${body.data.object.id}`;
    },
  },
  sampleEmit,
};
