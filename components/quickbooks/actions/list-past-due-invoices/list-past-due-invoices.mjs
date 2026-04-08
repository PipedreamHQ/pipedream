import { buildInvoiceListQuery } from "../../common/build-invoice-list-query.mjs";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-list-past-due-invoices",
  name: "List Past Due Invoices",
  description: "Lists open invoices whose due date is before today (UTC date). Optionally supply a full [Invoice query](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#query-an-invoice) to override the default filter. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#query-an-invoice)",
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
      description: "Full QuickBooks query string. When omitted, the action runs `select * from Invoice where Balance > '0' and DueDate < '<today>'` using today's date in UTC (plus optional sort/pagination below).",
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
    const today = new Date()
      .toISOString()
      .split("T")[0];
    const sql = buildInvoiceListQuery({
      customQuery: this.query,
      defaultSql: `select * from Invoice where Balance > '0' and DueDate < '${today}'`,
      orderClause: this.orderClause,
      startPosition: this.startPosition,
      maxResults: this.maxResults,
    });

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
