import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bitdefender_gravityzone-new-endpoint-added-instant",
  name: "New Endpoint Added (Instant)",
  description: "Emit new event when a new endpoint is registered in Bitdefender GravityZone.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return {
        "endpoint-moved-in": true,
      };
    },
    generateMeta(item) {
      return {
        id: item.endpointId,
        summary: `New Endpoint Added: ${item.endpointId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
