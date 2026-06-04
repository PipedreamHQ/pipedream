import app from "../../deel.app.mjs";

export default {
  key: "deel-list-timesheets",
  name: "List Timesheets",
  description:
    "List IC contractor timesheets in Deel with optional filters for contract, status, date range,"
    + " and contract type."
    + " Returns timesheet IDs, contract info, hours worked, status, and pay period."
    + " Use **List Contracts** to find contract IDs for filtering."
    + " [See the documentation](https://developer.deel.com/docs/list-timesheets)",
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
      optional: true,
    },
    statuses: {
      type: "string[]",
      label: "Statuses",
      description: "Filter by timesheet status (e.g., `pending`, `approved`, `declined`).",
      optional: true,
    },
    contractTypes: {
      type: "string[]",
      label: "Contract Types",
      description: "Filter by contract type (e.g., `fixed_rate_contract`, `pay_as_you_go_contract`).",
      optional: true,
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "Start date filter in ISO 8601 format (e.g., `2026-01-01`).",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "End date filter in ISO 8601 format (e.g., `2026-06-30`).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of timesheets to return.",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of records to skip for pagination.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.contractId) params.contract_id = this.contractId;
    if (this.statuses?.length) params["statuses[]"] = this.statuses;
    if (this.contractTypes?.length) params["contract_types[]"] = this.contractTypes;
    if (this.dateFrom) params.date_from = this.dateFrom;
    if (this.dateTo) params.date_to = this.dateTo;
    if (this.limit != null) params.limit = this.limit;
    if (this.offset != null) params.offset = this.offset;

    const response = await this.app._makeRequest({
      $,
      path: "/timesheets",
      params,
    });

    const timesheets = response?.data ?? response ?? [];
    $.export("$summary", `Retrieved ${Array.isArray(timesheets)
      ? timesheets.length
      : 0} timesheets`);
    return response;
  },
};
