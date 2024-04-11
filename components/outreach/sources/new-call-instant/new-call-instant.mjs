import common from "../common/base.mjs";

export default {
  ...common,
  key: "outreach-new-call-instant",
  name: "New Call Instant",
  description: "Emit new event when a call is created, updated, or deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResource() {
      return "call";
    },
  },
};
