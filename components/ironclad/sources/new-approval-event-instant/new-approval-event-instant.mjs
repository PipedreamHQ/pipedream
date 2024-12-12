import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ironclad-new-approval-event-instant",
  name: "New Approval Event Instant",
  description: "Emit new event when a fresh approval event is generated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "workflow_approval_status_changed",
      ];
    },
  },
  sampleEmit,
};
