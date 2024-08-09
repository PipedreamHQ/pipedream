import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whautomate-new-client-created-instant",
  name: "New Client Created (Instant)",
  description: "Emit new event when a new client is created in Whautomate.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "client_created",
      ];
    },
    getSummary(body) {
      return `New client created: ${body.client.fullName}`;
    },
  },
  sampleEmit,
};
