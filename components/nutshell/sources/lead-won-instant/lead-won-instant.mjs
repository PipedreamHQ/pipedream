import nutshell from "../../nutshell.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nutshell-lead-won-instant",
  name: "New Lead Won (Instant)",
  description: "Emits a new event when a lead is won. This usually means a successful deal. [See the documentation](https://developers.nutshell.com/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    nutshell,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    async fetchLeads() {
      const lastLeadId = this.db.get("lastLeadId") || 0;
      const leads = await this.nutshell._makeRequest({
        method: "POST",
        path: "/api/v1/json",
        data: {
          method: "searchLeads",
          params: {
            status: 10, // Status for 'won' leads
            limit: 100,
          },
          id: 1,
        },
      });

      const newLeads = leads.filter((lead) => lead.id > lastLeadId);
      if (newLeads.length > 0) {
        this.db.set("lastLeadId", newLeads[0].id);
      }

      return newLeads;
    },
  },
  async run() {
    const newLeads = await this.fetchLeads();
    for (const lead of newLeads) {
      this.$emit(lead, {
        id: lead.id,
        summary: `Lead Won: ${lead.name}`,
        ts: Date.parse(lead.closedTime),
      });
    }
  },
};
