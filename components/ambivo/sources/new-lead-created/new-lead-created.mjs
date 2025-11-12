import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ambivo-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created in Ambivo CRM.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.ambivo.listLeads;
    },
    getTsField() {
      return "created_date";
    },
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: `New Lead: ${lead.name}`,
        ts: Date.parse(lead.created_date),
      };
    },
  },
  sampleEmit,
};
