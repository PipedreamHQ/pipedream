import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "callingly-new-lead-created-instant",
  name: "New Lead Created (Instant)",
  description: "Emit new event when a new lead is created in Callingly. [See the documentation](https://help.callingly.com/article/38-callingly-api-documentation#Create-a-Webhook-fv07m)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "lead_created";
    },
    generateMeta(lead) {
      const ts = Date.now();
      return {
        id: `${lead.id}-${ts}`,
        summary: `New lead created: ${lead.fname || ""} ${lead.lname || ""} (${lead.email || lead.phone_number})`,
        ts,
      };
    },
  },
  sampleEmit,
};
