import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bitdefender_gravityzone-new-threat-detected-instant",
  name: "New Threat Detected (Instant)",
  description: "Emit new event when a potentially dangerous application is detected and blocked on an endpoint",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return {
        "avc": true,  // advanced threat control
      };
    },
    generateMeta() {
      return {
        id: Date.now(),
        summary: "New Threat Detected",
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
