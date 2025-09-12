import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Leave Request Created",
  description: "Emit new event when a new leave request is created in the system. [See the documentation](https://developers.buddee.nl/#2c5f483b-63d4-4ecf-a9d1-7efe36563639)",
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
