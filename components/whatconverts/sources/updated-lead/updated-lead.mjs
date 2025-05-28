import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "whatconverts-updated-lead",
  name: "Updated Lead",
  description: "Emit new event when a lead is updated",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.whatconverts.listLeads;
    },
    getTsField() {
      return "last_updated";
    },
    isSorted() {
      return false;
    },
    generateMeta(item) {
      const ts = Date.parse(item.last_updated);
      return {
        id: `${item.lead_id}${ts}`,
        summary: `Lead Updated with ID: ${item.lead_id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
