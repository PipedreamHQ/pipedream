import app from "../../deel.app.mjs";

export default {
  key: "deel-list-contracts",
  name: "List Contracts",
  description:
    "List and search all contracts in Deel across IC (independent contractor), EOR (employer of record),"
    + " and GP (global payroll) types. Use this to find contract IDs, check statuses, or browse the"
    + " contractor/employee roster. Supports filtering by search term, status, contract type, team, and"
    + " country. Returns contract ID, title, type, status, worker name, and start date."
    + " [See the documentation](https://developer.deel.com/docs/list-all-contracts)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      type: "string",
      label: "Search",
      description: "Search by contract title or worker name.",
      optional: true,
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter by contract status. Valid values include `pending`, `active`, `ended`, `cancelled`.",
      optional: true,
    },
    types: {
      type: "string[]",
      label: "Contract Types",
      description: "Filter by contract type. Valid values include `fixed_rate_contract`, `pay_as_you_go_contract`, `milestone_contract`, `eor_employee`, `global_payroll_employee`.",
      optional: true,
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "Filter contracts by client team ID.",
      optional: true,
    },
    countries: {
      type: "string[]",
      label: "Countries",
      description: "Filter by worker country. Use ISO 3166-1 alpha-2 codes (e.g., `DE`, `US`, `GB`).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of contracts to return (default: 50).",
      optional: true,
    },
    afterCursor: {
      type: "string",
      label: "After Cursor",
      description: "Cursor for pagination. Use the `after_cursor` value from a previous response to get the next page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.search) params.search = this.search;
    if (this.statuses?.length) params["statuses[]"] = this.statuses;
    if (this.types?.length) params["types[]"] = this.types;
    if (this.teamId) params.team_id = this.teamId;
    if (this.countries?.length) params["countries[]"] = this.countries;
    if (this.limit) params.limit = this.limit;
    if (this.afterCursor) params.after_cursor = this.afterCursor;

    const response = await this.app.listContracts($, params);

    const contracts = response?.data ?? response ?? [];
    $.export("$summary", `Retrieved ${Array.isArray(contracts)
      ? contracts.length
      : 0} contracts`);
    return response;
  },
};
