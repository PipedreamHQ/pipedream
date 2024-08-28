import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fatture_in_cloud-receive-raw-event-instant",
  name: "New Raw Event (Instant)",
  description: "Emit new event when a new event webhook from Fatture in Cloud is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary() {
      return "New raw event";
    },
    getContentMode() {
      return "binary";
    },
  },
  sampleEmit,
};
