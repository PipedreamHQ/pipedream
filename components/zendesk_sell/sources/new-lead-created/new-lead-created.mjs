import common from "../common/base.mjs";

export default {
  ...common,
  key: "zendesk_sell-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created in Zendesk Sell.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zendeskSell.listLeads;
    },
    getSummary(lead) {
      return `New Lead ID: ${lead.id}`;
    },
  },
};
