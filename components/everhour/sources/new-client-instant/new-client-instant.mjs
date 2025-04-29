import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "everhour-new-client-instant",
  name: "New Client (Instant)",
  description: "Emit new event when a client is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "api:client:created",
      ];
    },
    getSummary(body) {
      return `New Client: ${body.payload.data.name}`;
    },
  },
  sampleEmit,
};
