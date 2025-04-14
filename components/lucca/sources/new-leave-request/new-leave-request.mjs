import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lucca-new-leave-request",
  name: "New Leave Request",
  description: "Emit new event when a new leave request is submitted by an employee. [See the documentation](https://developers.lucca.fr/api-reference/legacy/timmi-absences/leave-requests/list-leave-requests)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listLeaveRequests;
    },
    getSummary(item) {
      return `New Leave Request with ID: ${item.id}`;
    },
  },
  sampleEmit,
};
