import instantReply from "../../instant_reply.app.mjs";

export default {
  key: "instant_reply-update-lead-stage",
  name: "Update Lead Stage",
  description: "Move a pipeline lead to a different stage in your Instant Reply CRM pipeline. [See the docs](https://www.instantreply.co/developers)",
  version: "0.1.0",
  type: "action",
  props: {
    instantReply,
    leadId: {
      type: "string",
      label: "Lead ID",
      description: "The UUID of the pipeline lead to update",
    },
    stage: {
      type: "string",
      label: "New Stage",
      description: "The pipeline stage to move this lead to (e.g. 'qualified', 'proposal', 'closed_won')",
    },
    score: {
      type: "integer",
      label: "Lead Score",
      description: "Update the lead score (0–100)",
      min: 0,
      max: 100,
      optional: true,
    },
    value: {
      type: "number",
      label: "Deal Value",
      description: "Monetary value of this deal",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Internal notes to attach to this lead",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.instantReply._makeRequest({
      $,
      method: "PATCH",
      path: `/pipeline/leads/${this.leadId}`,
      data: {
        stage: this.stage,
        score: this.score ?? undefined,
        value: this.value ?? undefined,
        notes: this.notes || undefined,
      },
    });
    $.export("$summary", `Lead ${this.leadId} moved to stage: ${this.stage}`);
    return response;
  },
};
