import app from "../../deel.app.mjs";

export default {
  key: "deel-amend-ic-contract",
  name: "Amend IC Contract",
  description:
    "Update an independent contractor (IC) contract in Deel — change the rate, currency, payment scale,"
    + " frequency, job title, or scope of work."
    + " All amendment fields are optional; provide only the fields you want to change."
    + " `effective_date` is required — use today's date or earlier (ISO 8601 format, e.g., `2026-06-01`)."
    + " The amendment takes effect immediately but is recorded with the given date."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/docs/amend-a-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    effectiveDate: {
      type: "string",
      label: "Effective Date",
      description: "Date when the amendment takes effect, in ISO 8601 format (e.g., `2026-08-01`).",
    },
    amount: {
      type: "string",
      label: "New Amount",
      description: "New compensation amount (e.g., `5500`).",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "ISO 4217 currency code for the new amount (e.g., `USD`, `EUR`).",
      optional: true,
    },
    scale: {
      type: "string",
      label: "Compensation Scale",
      description: "New compensation scale. One of: `hour`, `day`, `week`, `month`, `year`, `task`, `milestone`.",
      optional: true,
    },
    frequency: {
      type: "string",
      label: "Payment Frequency",
      description: "New payment frequency. One of: `weekly`, `biweekly`, `semimonthly`, `monthly`.",
      optional: true,
    },
    jobTitleName: {
      type: "string",
      label: "Job Title",
      description: "New job title for the contractor.",
      optional: true,
    },
    scopeOfWork: {
      type: "string",
      label: "Scope of Work",
      description: "Updated description of work to be performed.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      effective_date: this.effectiveDate,
    };
    if (this.amount) payload.amount = parseFloat(this.amount);
    if (this.currencyCode) payload.currency_code = this.currencyCode;
    if (this.scale) payload.scale = this.scale;
    if (this.frequency) payload.frequency = this.frequency;
    if (this.jobTitleName) payload.job_title_name = this.jobTitleName;
    if (this.scopeOfWork) payload.scope_of_work = this.scopeOfWork;

    const response = await this.app._makeRequest({
      $,
      path: `/contracts/${this.contractId}/amendments`,
      method: "POST",
      data: {
        data: payload,
      },
    });

    $.export("$summary", `Amended IC contract ${this.contractId} effective ${this.effectiveDate}`);
    return response;
  },
};
