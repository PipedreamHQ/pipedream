import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nextlead-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is captured in NextLead. [See the documentation](https://dashboard.nextlead.app/en/api-documentation#created)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: "New Lead Created",
        ts: Date.now(),
      };
    },
  },
  async run() {
    const leads = await this.nextlead.getNewlyCreatedLeads();
    for (const lead of leads) {
      const meta = this.generateMeta(lead);
      this.$emit(lead, meta);
    }
  },
  sampleEmit,
};
