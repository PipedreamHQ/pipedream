import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-list-open-invoices",
  name: "List Open Invoices",
  description: "Lists invoices with an outstanding balance (open invoices). Optionally supply a full query to override the default filter. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#query-an-invoice)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    query: {
      type: "string",
      label: "Query",
      optional: true,
      description: "Full QuickBooks query string. When omitted, the action runs `select * from Invoice where Balance > '0'` (plus optional sort/pagination below).",
    },
    maxResults: {
      propDefinition: [
        quickbooks,
        "maxResults",
      ],
    },
    orderClause: {
      propDefinition: [
        quickbooks,
        "orderClause",
      ],
    },
    startPosition: {
      description: "The starting count of the response for pagination.",
      label: "Start Position",
      optional: true,
      type: "string",
    },
  },
  async run({ $ }) {
    let sql = this.query;
    if (!sql) {
      sql = "select * from Invoice where Balance > '0'";
      const orderClause = this.orderClause
        ? ` ORDERBY  ${this.orderClause}`
        : "";
      const startPosition = this.startPosition
        ? ` STARTPOSITION  ${this.startPosition}`
        : "";
      const maxResults = this.maxResults
        ? ` MAXRESULTS ${this.maxResults}`
        : "";
      sql += `${orderClause}${startPosition}${maxResults}`;
    }

    const response = await this.quickbooks.query({
      $,
      params: {
        query: sql,
      },
    });

    if (response) {
      $.export("summary", "Successfully retrieved invoices");
    }

    return response;
  },
};
