import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "callrail-new-sms-received-instant",
  name: "New SMS Received (Instant)",
  description: "Emit new event when a text message is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfigs(endpoint) {
      return {
        sms_received_webhook: [
          endpoint,
        ],
      };
    },
    getSummary(details) {
      return `A new SMS with ID ${details.id} has been received`;
    },
  },
  sampleEmit,
};
