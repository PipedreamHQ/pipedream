import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "typeflowai-new-response-created",
  name: "New Response Created (Instant)",
  description: "Emit new event when a response is created for a workflow in TypeflowAI. [See the documentation](https://typeflowai.com/docs/api/management/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "responseCreated",
      ];
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New Response Created with ID: ${data.id}`,
        ts: Date.parse(data.createdAt),
      };
    },
  },
  sampleEmit,
};
