import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "vtiger_crm-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created in VTiger CRM.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    async getResources(modifiedTime) {
      const { result: { updated: leads } } = await this.vtiger.getSync({
        params: {
          modifiedTime,
          elementType: "Leads",
          syncType: "user",
        },
      });
      return leads;
    },
    getTsField() {
      return "createdtime";
    },
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: `New Lead with ID ${lead.id}`,
        ts: Date.parse(lead.createdtime),
      };
    },
  },
  sampleEmit,
};
