import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "_1crm-new-or-updated-lead-instant",
  name: "New or Updated Lead (Instant)",
  description: "Emit new event when a lead is updated or created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModel() {
      return "Lead";
    },
    getSummary(body) {
      return `New or updated lead: ${body.id}`;
    },
  },
  sampleEmit,
};
