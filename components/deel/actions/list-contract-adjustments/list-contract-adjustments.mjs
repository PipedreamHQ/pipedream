import app from "../../deel.app.mjs";

export default {
  key: "deel-list-contract-adjustments",
  name: "List Contract Adjustments",
  description:
    "List all adjustments (bonuses, deductions, expenses, etc.) for a specific Deel contract."
    + " Works for both IC and EOR contracts."
    + " Optionally filter by date range."
    + " Use **List Contracts** to find the contract ID."
    + " [See the documentation](https://developer.deel.com/docs/list-adjustments-for-a-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contractId: {
      propDefinition: [
        app,
        "contractId",
      ],
    },
    from: {
      type: "string",
      label: "From Date",
      description: "Start of the date range filter in ISO 8601 format (e.g., `2026-01-01`).",
      optional: true,
    },
    to: {
      type: "string",
      label: "To Date",
      description: "End of the date range filter in ISO 8601 format (e.g., `2026-12-31`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.from) params.from = this.from;
    if (this.to) params.to = this.to;

    const response = await this.app._makeRequest({
      $,
      path: `/contracts/${this.contractId}/adjustments`,
      params,
    });

    const adjustments = response?.data ?? response ?? [];
    $.export("$summary", `Retrieved ${Array.isArray(adjustments)
      ? adjustments.length
      : 0} adjustments for contract ${this.contractId}`);
    return response;
  },
};
