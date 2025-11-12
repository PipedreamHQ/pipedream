import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "alegra-new-client-instant",
  name: "New Client Created (Instant)",
  description: "Emit new event when a new client is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "new-client";
    },
    getSummary({ client }) {
      return `New client created: ${client.email} - (${client.email})`;
    },
  },
  sampleEmit,
};
