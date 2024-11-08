import common from "../common/base.mjs";

export default {
  ...common,
  key: "insertchat-new-lead",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.insertchat.listLeads;
    },
    getSummary(item) {
      return `New Lead ID: ${item.uid}`;
    },
  },
};
