import { axios } from "@pipedream/platform";
import proofly from "../../proofly.app.mjs";

export default {
  key: "proofly-new-lead-collected",
  name: "New Lead Collected",
  description: "Emits an event when a new lead is collected. [See the documentation](https://proofly.io/developers)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    proofly,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    leadId: {
      propDefinition: [
        proofly,
        "leadId",
      ],
    },
    leadName: {
      propDefinition: [
        proofly,
        "leadName",
        (c) => ({
          optional: true,
        }),
      ],
    },
    source: {
      propDefinition: [
        proofly,
        "source",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const leads = await this.proofly.getNotificationById({
        notificationId: this.leadId,
      });

      if (!Array.isArray(leads) || !leads.length) return;

      // Sort leads by time in descending order to emit the most recent ones
      leads.sort((a, b) => new Date(b.time) - new Date(a.time));

      // Emit at most the last 50 leads
      const recentLeads = leads.slice(0, 50);
      for (const lead of recentLeads) {
        this.$emit(lead, {
          id: lead.dataId,
          summary: `New Lead: ${lead.dataContent}`,
          ts: Date.parse(lead.time),
        });
      }

      // Store the ID of the most recent lead to avoid re-emitting it
      if (recentLeads.length > 0) {
        this.db.set("lastLeadId", recentLeads[0].dataId);
      }
    },
  },
  async run() {
    const lastLeadId = this.db.get("lastLeadId") || null;
    const leads = await this.proofly.getNotificationById({
      notificationId: this.leadId,
    });

    if (!Array.isArray(leads) || !leads.length) return;

    // Filter out already emitted leads
    const newLeads = leads.filter((lead) => lead.dataId !== lastLeadId);

    for (const lead of newLeads) {
      this.$emit(lead, {
        id: lead.dataId,
        summary: `New Lead: ${lead.dataContent}`,
        ts: Date.parse(lead.time),
      });
    }

    // Store the ID of the most recent lead to avoid re-emitting it
    if (newLeads.length > 0) {
      this.db.set("lastLeadId", newLeads[0].dataId);
    }
  },
};
