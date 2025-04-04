import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openphone-new-outgoing-call-completed-instant",
  name: "New Outgoing Call Completed (Instant)",
  description: "Emit new event when an outgoing call has ended.",
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
      return "New Outgoing Call Completed";
    },
    getEventFilter(body) {
      return body.data.object.direction === "outgoing";
    },
  },
  sampleEmit,
};
