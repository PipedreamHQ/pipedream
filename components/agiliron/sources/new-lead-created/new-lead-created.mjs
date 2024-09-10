import { axios } from "@pipedream/platform";
import agiliron from "../../agiliron.app.mjs";

export default {
  key: "agiliron-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when a new lead is created in Agiliron. [See the documentation](https://api.agiliron.com/reference/add-lead)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    agiliron,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      await this.emitNewLeadEvents();
    },
    async activate() {
      // No webhook support, rely on polling
    },
    async deactivate() {
      // No webhook support, nothing to clean up
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    async emitNewLeadEvents() {
      const leads = await this.agiliron.getLeads({
        params: {
          filter: `CreatedTimeUTC,gt,${this._getLastTimestamp()}`,
          pageSize: 50,
        },
      });

      for (const lead of leads.Leads.Lead) {
        this.$emit(lead, {
          id: lead.LeadId,
          summary: `New lead: ${lead.FirstName} ${lead.LastName}`,
          ts: new Date(lead.CreatedTimeUTC).getTime(),
        });
      }

      if (leads.Leads.Lead.length > 0) {
        const lastLead = leads.Leads.Lead[leads.Leads.Lead.length - 1];
        this._setLastTimestamp(new Date(lastLead.CreatedTimeUTC).getTime());
      }
    },
  },
  async run() {
    await this.emitNewLeadEvents();
  },
};
