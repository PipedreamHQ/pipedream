import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "paradym-new-verification-response-instant",
  name: "New Verification Response (Instant)",
  description: "Emit new event when a verification results in a confirmed response from the user.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        events.OPENID4VC_VERIFICATION_VERIFIED,
        events.DIDCOMM_VERIFICATION_VERIFIED,
      ];
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.webhookPublishedAt);
      return {
        id: ts,
        summary: "New Verification Response",
        ts,
      };
    },
  },
  sampleEmit,
};
