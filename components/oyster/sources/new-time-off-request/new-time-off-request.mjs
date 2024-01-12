import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "oyster-new-time-off-request",
  name: "New Time Off Request",
  description: "Emit new event when a new time off request is made. [See the documentation](https://docs.oysterhr.com/reference/get_v1-time-off-requests)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    async deploy() {
      await this.processEvent(null, 25);
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.oyster.listTimeOffRequests;
    },
    generateMeta(request) {
      return {
        id: request.timeOffRequestId,
        summary: `New Time Off Request ${request.timeOffRequestId}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    await this.processEvent();
  },
  sampleEmit,
};
