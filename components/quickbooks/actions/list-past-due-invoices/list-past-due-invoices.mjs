import {
  assertCustomQueryTargetsInvoice,
  buildInvoiceListQuery,
  invoicesFromInvoiceQueryResponse,
} from "../../common/build-invoice-list-query.mjs";
import { getCompanyLocalTodayYyyyMmDd } from "../../common/quickbooks-company-date.mjs";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-list-past-due-invoices",
  name: "List Past Due Invoices",
  description: "Lists open invoices whose due date is before today in the company's time zone (from CompanyInfo.DefaultTimeZone when available). Optionally supply a full [Invoice query](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#query-an-invoice) to override the default filter. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/invoice#query-an-invoice)",
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
      description: "Full QuickBooks query string targeting Invoice. When omitted, the action runs `select * from Invoice where Balance > '0' and DueDate < '<today>'` using today's date in the company time zone (plus optional sort/pagination below).",
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
      propDefinition: [
        quickbooks,
        "startPosition",
      ],
    },
  },
  async run({ $ }) {
    assertCustomQueryTargetsInvoice(this.query);

    const trimmedQuery = typeof this.query === "string"
      ? this.query.trim()
      : "";
    const today = trimmedQuery
      ? null
      : await getCompanyLocalTodayYyyyMmDd(this.quickbooks, $);
    const defaultSql = today != null
      ? `select * from Invoice where Balance > '0' and DueDate < '${today}'`
      : "select * from Invoice where Balance > '0'";

    const sql = buildInvoiceListQuery({
      customQuery: this.query,
      defaultSql,
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

    const invoices = invoicesFromInvoiceQueryResponse(response);
    if (invoices.length > 0) {
      $.export("summary", `Successfully retrieved ${invoices.length} invoices`);
    } else {
      $.export("summary", "No invoices found");
    }

    return {
      invoices,
      raw: response,
    };
  },
};
