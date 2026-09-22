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
    getConfigs(config = {}, endpoint) {
      return {
        ...config,
        sms_received_webhook: [
          ...(config.sms_received_webhook || []),
          endpoint,
        ],
      };
    },
    removeConfig(config = {}, url) {
      return {
        ...config,
        sms_received_webhook: (config.sms_received_webhook || [])
          .filter((endpoint) => endpoint !== url),
      };
    },
    getSummary(details) {
      return `A new SMS with ID ${details.id} has been received`;
    },
  },
  sampleEmit,
};
