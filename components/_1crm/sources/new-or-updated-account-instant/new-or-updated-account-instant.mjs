import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "_1crm-new-or-updated-account-instant",
  name: "New or Updated Account (Instant)",
  description: "Emit new event when an account is updated or created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getModel() {
      return "Account";
    },
    getSummary(body) {
      return `New or updated account: ${body.name}`;
    },
  },
  sampleEmit,
};
