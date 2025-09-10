import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Time Registration Created",
  description: "Emit new event when a new time registration is created in the system",
  key: "buddee-new-time-registration-created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.buddee.getTimeRegistrations;
    },
    getSortKey() {
      return "created_at";
    },
    getSummary(item) {
      return `New Time Registration: ${item.id}`;
    },
  },
  sampleEmit,
};
