import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "typeflowai-new-response-finished",
  name: "New Response Finished (Instant)",
  description: "Emit new event when a response is marked as finished. [See the documentation](https://typeflowai.com/docs/api/management/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "responseFinished",
      ];
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New Response Finished with ID: ${data.id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
