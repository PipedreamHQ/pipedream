import common from "../common/common.mjs";

export default {
  ...common,
  key: "workiz-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created in Workiz. [See the documentation](https://developer.workiz.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.workiz.listLeads;
    },
    generateMeta(lead) {
      return {
        id: lead.UUID,
        summary: `New Lead ${lead.UUID}`,
        ts: Date.parse(lead.CreatedDate),
      };
    },
  },
};
