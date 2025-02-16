import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "invoice_ninja-new-client-instant",
  name: "New Client (Instant)",
  description: "Emit new event when a new client is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return 1;
    },
    getSummary(client) {
      return `New client: ${client.name}`;
    },
  },
  sampleEmit,
};
