import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "callingly-lead-updated-instant",
  name: "Lead Updated (Instant)",
  description: "Emit new event when a lead is updated in Callingly. [See the documentation](https://help.callingly.com/article/38-callingly-api-documentation#Create-a-Webhook-fv07m)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "lead_updated";
    },
    generateMeta(lead) {
      const ts = Date.parse(lead.updatedValue.updated_at) || Date.now();
      return {
        id: `${lead.id}-${ts}`,
        summary: `Lead updated: ${lead.fname || ""} ${lead.lname || ""} (${lead.email || lead.phone_number})`,
        ts,
      };
    },
  },
  sampleEmit,
};
