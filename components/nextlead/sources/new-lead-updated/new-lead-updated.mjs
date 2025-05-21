import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nextlead-new-lead-updated",
  name: "New Lead Updated",
  description: "Emit new event when a lead is updated in NextLead. [See the documentation](https://dashboard.nextlead.app/en/api-documentation#edited)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: "Lead Updated",
        ts: Date.now(),
      };
    },
  },
  async run() {
    const leads = await this.nextlead.getNewlyUpdatedLeads();
    for (const lead of leads) {
      const meta = this.generateMeta(lead);
      this.$emit(lead, meta);
    }
  },
  sampleEmit,
};
