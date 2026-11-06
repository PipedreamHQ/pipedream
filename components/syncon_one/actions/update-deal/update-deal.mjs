import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-update-deal",
  name: "Update Deal",
  description: "Changes a deal in Syncon One. Only the fields you fill in are changed.",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    id: {
      type: "string",
      label: "Deal ID",
      description: "The id of the deal, from an earlier step or a search.",
    },
    name: { type: "string", label: "Name", description: "The name.", optional: true },
    company: { type: "string", label: "Company", description: "The company.", optional: true },
    stage: { type: "string", label: "Stage", description: "The stage.", optional: true },
    amount: { type: "integer", label: "Amount", description: "The amount.", optional: true },
    currency: { type: "string", label: "Currency", description: "The currency.", optional: true },
    probability: {
      type: "integer",
      label: "Probability",
      description: "The probability.",
      optional: true,
    },
    close_date: {
      type: "string",
      label: "Expected close",
      description: "The expected close.",
      optional: true,
    },
    owner: { type: "string", label: "Owner", description: "The owner.", optional: true },
    next_step: {
      type: "string",
      label: "Next step",
      description: "The next step.",
      optional: true,
    },
    next_step_due_at: {
      type: "string",
      label: "Next step due",
      description: "The next step due.",
      optional: true,
    },
    competitor: {
      type: "string",
      label: "Competitor",
      description: "The competitor.",
      optional: true,
    },
    source: { type: "string", label: "Source", description: "The source.", optional: true },
    description: { type: "string", label: "Notes", description: "The notes.", optional: true },
    win_reason: {
      type: "string",
      label: "Why we won",
      description: "The why we won.",
      optional: true,
    },
    lost_reason: {
      type: "string",
      label: "Why we lost",
      description: "The why we lost.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    for (const key of [
      "name",
      "company",
      "stage",
      "amount",
      "currency",
      "probability",
      "close_date",
      "owner",
      "next_step",
      "next_step_due_at",
      "competitor",
      "source",
      "description",
      "win_reason",
      "lost_reason",
    ]) {
      if (this[key] !== undefined && this[key] !== "") data[key] = this[key];
    }
    const response = await this.syncOne.update({ $, path: "/opportunities", id: this.id, data });
    $.export("$summary", `Updated deal ${this.id}`);
    return response.data;
  },
};
