import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openphone-new-incoming-call-completed-instant",
  name: "New Incoming Call Completed (Instant)",
  description: "Emit new event when an incoming call is completed, including calls not picked up or voicemails left.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "call.completed",
      ];
    },
    getSummary() {
      return "New Incoming Call Completed";
    },
    getEventFilter(body) {
      return body.data.object.direction === "incoming";
    },
  },
  sampleEmit,
};
