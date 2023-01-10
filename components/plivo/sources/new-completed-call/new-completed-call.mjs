import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "plivo-new-completed-call",
  name: "New Completed Call",
  description: "Emit new event when a call is completed. [See the docs](https://www.plivo.com/docs/voice/api/call#retrieve-all-calls).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listCalls;
    },
    getResourcesFnArgs() {
      const lastEndTime = this.getLastEndTime();
      if (lastEndTime) {
        return {
          limit: constants.DEFAULT_LIMIT,
          end_time__gt: lastEndTime,
        };
      }
      return {
        limit: constants.DEFAULT_LIMIT,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.callUuid,
        ts: Date.parse(resource.initiationTime),
        summary: `New Call ID ${resource.callUuid}`,
      };
    },
  },
};
