import syncOne from "../../syncon_one.app.mjs";

export default {
  key: "syncon_one-create-deal",
  name: "Create Deal",
  description:
    "Adds a deal in Syncon One. [See the API reference](https://synconone.com/docs/api-reference).",
  version: "0.0.1",
  type: "action",
  annotations: { destructiveHint: false, openWorldHint: true, readOnlyHint: false },
  props: {
    syncOne,
    name: { type: "string", label: "Name", description: "The name.", optional: true },
    company: { type: "string", label: "Company", description: "The company.", optional: true },
    person: {
      type: "string",
      label: "Primary contact",
      description: "The primary contact.",
      optional: true,
    },
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
      "person",
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
    const response = await this.syncOne.create({ $, path: "/opportunities", data });
    $.export("$summary", `Created deal ${response.data?.id ?? ""}`);
    return response.data;
  },
};
