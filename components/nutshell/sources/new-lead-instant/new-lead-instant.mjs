import { axios } from "@pipedream/platform";
import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-new-lead-instant",
  name: "New Lead Instant",
  description: "Emits a new event when a new lead is created. [See the documentation](https://developers.nutshell.com/)",
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
    leadName: {
      type: "string",
      label: "Lead Name",
      description: "The name of the lead.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the lead.",
    },
    forecastedCloseDate: {
      type: "string",
      label: "Forecasted Close Date",
      description: "The forecasted close date of the lead.",
      optional: true,
    },
    value: {
      type: "integer",
      label: "Value",
      description: "The value of the lead.",
      optional: true,
    },
    followUpDate: {
      type: "string",
      label: "Follow-Up Date",
      description: "The follow-up date for the lead.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Placeholder for the deploy hook logic, if needed.
    },
    async activate() {
      // Placeholder for the activate hook logic, if needed.
    },
    async deactivate() {
      // Placeholder for the deactivate hook logic, if needed.
    },
  },
  async run() {
    const leads = await this.nutshell.initiateLead({
      leadName: this.leadName,
      source: this.source,
      forecastedCloseDate: this.forecastedCloseDate || "",
      value: this.value || 0,
      followUpDate: this.followUpDate || "",
    });

    leads.forEach((lead) => {
      const event = {
        id: lead.id,
        summary: `New Lead: ${lead.name}`,
        ts: new Date(lead.createdTime).getTime(),
      };
      this.$emit(lead, event);
    });
  },
};
