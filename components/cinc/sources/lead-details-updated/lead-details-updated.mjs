import common from "../common/base.mjs";

export default {
  ...common,
  key: "cinc-lead-details-updated",
  name: "Lead Details Updated",
  description: "Emit new event when a lead's information is updated in Cinc",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(lead) {
      const ts = Date.parse(lead.info.updated_date);
      return {
        id: `${lead.id}-${ts}`,
        summary: `Lead Updated ${lead.id}`,
        ts,
      };
    },
  },
};
