import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whatconverts-new-lead-added",
  name: "New Lead Added",
  description: "Emit new event when a new lead is added",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.whatconverts.listLeads;
    },
    getTsField() {
      return "date_created";
    },
    generateMeta(item) {
      return {
        id: item.lead_id,
        summary: `New Lead ID: ${item.lead_id}`,
        ts: Date.parse(item.date_created),
      };
    },
  },
  sampleEmit,
};
