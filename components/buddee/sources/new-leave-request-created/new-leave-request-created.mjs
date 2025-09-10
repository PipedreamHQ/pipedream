import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Leave Request Created",
  description: "Emit new event when a new leave request is created in the system",
  key: "buddee-new-leave-request-created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.buddee.getLeaveRequests;
    },
    getSortKey() {
      return "created_at";
    },
    getSummary(item) {
      return `New Leave Request: ${item.id}`;
    },
  },
  sampleEmit,
};
