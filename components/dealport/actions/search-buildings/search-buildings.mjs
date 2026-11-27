import app from "../../dealport.app.mjs";

export default {
  key: "dealport-search-buildings",
  name: "Search Commercial Buildings",
  description: "Search NYC multifamily and mixed-use commercial buildings across property, mortgage, and regulatory filings ($0.01 per new Record). [See the documentation](https://app.dealport.com/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    borough: {
      type: "string",
      label: "NYC Borough",
      description: "NYC borough code (`MN`, `BK`, `QN`, `BX`, or `SI`), e.g. `MN`.",
      options: [
        "MN",
        "BK",
        "QN",
        "BX",
        "SI",
      ],
    },
    minUnits: {
      type: "integer",
      label: "Minimum Residential Units",
      description: "Minimum residential unit count (default `10`), e.g. `20`.",
      optional: true,
      default: 10,
    },
    q: {
      type: "string",
      label: "Address or Owner Query",
      description: "Optional street address or owner-of-record substring match, e.g. `120 Broadway`.",
      optional: true,
    },
    loanDueBy: {
      type: "integer",
      label: "Loan Maturity Year Ceiling",
      description: "Estimated mortgage maturity year ceiling, e.g. `2027`.",
      optional: true,
    },
    loanHolder: {
      type: "string",
      label: "Loan Holder Type",
      description: "Filter by current mortgage holder category, e.g. `bank`.",
      optional: true,
      options: [
        "agency",
        "cmbs",
        "bank",
      ],
    },
    signal: {
      type: "string",
      label: "Building Signal",
      description: "Filter by regulatory, distress, or assisted-housing signal, e.g. `tax_lien`.",
      optional: true,
      options: [
        "rent_stabilized",
        "dob_penalties",
        "housing_court",
        "tax_lien",
        "ll97",
        "section8_expiring",
        "tax_credit_ending",
        "failing_inspection",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchBuildings({
      $,
      params: {
        borough: this.borough,
        min_units: this.minUnits,
        q: this.q,
        loan_due_by: this.loanDueBy,
        loan_holder: this.loanHolder,
        signal: this.signal,
        limit: this.limit,
        cursor: this.cursor,
      },
    });
    const items = response?.buildings ?? response?.items ?? [];
    $.export("$summary", `Returned ${items.length} building Record${items.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
