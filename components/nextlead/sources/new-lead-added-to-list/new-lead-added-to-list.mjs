import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nextlead-new-lead-added-to-list",
  name: "New Lead Added to List",
  description: "Emit new event when a lead is added to a list in NextLead. [See the documentation](https://dashboard.nextlead.app/en/api-documentation#addedToList)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(lead) {
      return {
        id: lead.id,
        summary: "Lead Added to List",
        ts: Date.parse(lead.result.created_at),
      };
    },
  },
  async run() {
    const leads = await this.nextlead.getContactsAddedToList();
    for (const lead of leads) {
      const meta = this.generateMeta(lead);
      this.$emit(lead, meta);
    }
  },
  sampleEmit,
};
