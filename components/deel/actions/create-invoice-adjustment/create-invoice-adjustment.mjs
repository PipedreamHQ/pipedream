import app from "../../deel.app.mjs";

export default {
  key: "deel-create-invoice-adjustment",
  name: "Create Invoice Adjustment",
  description:
    "Add a bonus, deduction, commission, expense, or other financial adjustment to an IC contractor's"
    + " Deel invoice."
    + " `type` must be one of: `bonus`, `commission`, `deduction`, `expense`, `other`, `overtime`,"
    + " `time_off`, `vat`."
    + " Set `is_auto_approved` to `true` to auto-approve without manual review."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/api/reference/endpoints/invoice-adjustments/create-invoice-adjustment)",
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
    type: {
      type: "string",
      label: "Adjustment Type",
      description: "Type of adjustment. One of: `bonus`, `commission`, `deduction`, `expense`, `other`, `overtime`, `time_off`, `vat`.",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The adjustment amount (e.g., `500`). Use a negative number for deductions.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of the adjustment (e.g., `Q2 performance bonus`).",
    },
    dateSubmitted: {
      type: "string",
      label: "Date Submitted",
      description: "The date of the adjustment in ISO 8601 format (e.g., `2026-07-01`).",
    },
    isAutoApproved: {
      type: "boolean",
      label: "Auto-Approve",
      description: "Set to `true` to automatically approve the adjustment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const amt = parseFloat(this.amount);
    if (!Number.isFinite(amt)) throw new Error(`Invalid amount: "${this.amount}" is not a finite number`);
    const payload = {
      contract_id: this.contractId,
      type: this.type,
      amount: amt,
      description: this.description,
      date_submitted: this.dateSubmitted,
    };
    if (this.isAutoApproved !== undefined) payload.is_auto_approved = this.isAutoApproved;

    const response = await this.app.createInvoiceAdjustment($, payload);

    const adj = response?.data ?? response;
    const adjId = adj?.id ?? "unknown";
    $.export("$summary", `Created ${this.type} adjustment ${adjId} of ${this.amount} for contract ${this.contractId}`);
    return response;
  },
};
