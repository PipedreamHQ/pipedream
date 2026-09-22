import common from "../common/base.mjs";

export default {
  ...common,
  key: "callingly-lead-tag-updated-instant",
  name: "Lead Tag Updated (Instant)",
  description: "Emit new event when a lead's tags are updated in Callingly. [See the documentation](https://help.callingly.com/article/38-callingly-api-documentation#Create-a-Webhook-fv07m)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "lead_updated";
    },
    getOtherOpts() {
      return {
        field: "tags",
      };
    },
    generateMeta(lead) {
      const ts = Date.parse(lead.updatedValue.updated_at) || Date.now();
      return {
        id: `${lead.id}-${ts}`,
        summary: `Lead tag updated to: ${lead.updatedValue.name}`,
        ts,
      };
    },
  },
};
