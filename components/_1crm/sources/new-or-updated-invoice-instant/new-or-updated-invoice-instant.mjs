import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "_1crm-new-or-updated-invoice-instant",
  name: "New or Updated Invoice (Instant)",
  description: "Emit new event when an invoice is updated or created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModel() {
      return "Invoice";
    },
    getSummary(body) {
      return `New or updated invoice: ${body.id}`;
    },
  },
  sampleEmit,
};
