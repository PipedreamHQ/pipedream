import common from "../common/base.mjs";

export default {
  ...common,
  key: "cinc-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is added in Cinc.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: `New Lead ${lead.id}`,
        ts: Date.parse(lead.info.updated_date),
      };
    },
  },
};
