import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-list-accounts",
  name: "List Accounts",
  description: "List accounts with selected fields (`accountid`, `name`, phone, email, primary contact). [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query-data-web-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoft,
    filter: {
      type: "string",
      label: "Filter",
      description: "Optional OData `$filter` (for example `statecode eq 0` for active accounts). [Filter reference](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query/filter-rows)",
      optional: true,
    },
    recordsPerPage: {
      type: "integer",
      label: "Records Per Page",
      description: "Page size (default 50)",
      optional: true,
      default: 50,
      min: 1,
      max: 5000,
    },
  },
  async run({ $ }) {
    const data = await this.microsoft.queryAccounts({
      $,
      filter: this.filter,
      top: this.recordsPerPage ?? 50,
    });

    const count = data?.value?.length ?? 0;
    $.export("$summary", `Retrieved ${count} account${count === 1
      ? ""
      : "s"}`);

    return data;
  },
};
