import {
  assertCustomQueryTargetsInvoice,
  buildInvoiceListQuery,
  invoicesFromInvoiceQueryResponse,
} from "../../common/build-invoice-list-query.mjs";
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
      description: "Full QuickBooks query string targeting Invoice. When omitted, the action runs `select * from Invoice where Balance > '0'` (plus optional sort/pagination below).",
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

    const sql = buildInvoiceListQuery({
      customQuery: this.query,
      defaultSql: "select * from Invoice where Balance > '0'",
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
