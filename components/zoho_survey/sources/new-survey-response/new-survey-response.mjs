import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zoho_survey-new-survey-response",
  name: "New Survey Response (Instant)",
  description: "Emit new event when a new survey response is received in Zoho Surveys.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "response_completed";
    },
    generateMeta(response) {
      return {
        id: response.RESPONSE_ID,
        summary: `New Response ${response.RESPONSE_ID}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
