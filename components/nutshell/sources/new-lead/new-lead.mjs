import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nutshell-new-lead",
  name: "New Lead",
  description: "Emit new event when a new lead is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getMethod() {
      return "findLeads";
    },
    getSummary({
      name, id,
    }) {
      return `New Lead: ${name || id}`;
    },
  },
  sampleEmit,
};
