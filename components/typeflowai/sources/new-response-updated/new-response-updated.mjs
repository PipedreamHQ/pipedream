import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "typeflowai-new-response-updated",
  name: "New Response Updated (Instant)",
  description: "Emit new event when a response is updated within a workflow. [See the documentation](https://typeflowai.com/docs/api/management/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "responseUpdated",
      ];
    },
    generateMeta(data) {
      const ts = Date.parse(data.updatedAt);
      return {
        id: `${data.id}-${ts}`,
        summary: `New Response Updated with ID: ${data.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
