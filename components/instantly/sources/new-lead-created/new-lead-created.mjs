import common from "../common/base.mjs";

export default {
  ...common,
  key: "instantly-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created. [See the documentation](https://developer.instantly.ai/api/v2/lead/listleads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.instantly.listLeads;
    },
    getArgs() {
      return {
        data: {},
      };
    },
    getTsField() {
      return "timestamp_created";
    },
    getSummary(item) {
      return `New Lead with ID: ${item.id}`;
    },
  },
};
