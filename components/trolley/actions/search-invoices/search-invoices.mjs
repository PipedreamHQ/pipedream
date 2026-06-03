import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-search-invoices",
  name: "Search Invoices",
  description: "Search for invoices using filter parameters. Returns all invoices in the merchant account if no filters are provided. [See the documentation](https://developers.trolley.com/api/#search-invoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
    invoiceIds: {
      type: "string[]",
      label: "Invoice IDs",
      description: "List of invoice IDs to retrieve (e.g., `I-xxxx`).",
      optional: true,
    },
    paymentIds: {
      type: "string[]",
      label: "Payment IDs",
      description: "List of payment IDs to retrieve invoices for (e.g., `P-xxxx`).",
      optional: true,
    },
    recipientIds: {
      type: "string[]",
      label: "Recipient IDs",
      description: "List of recipient IDs to filter by (e.g., `R-xxxx`).",
      optional: true,
    },
    invoiceNumbers: {
      type: "string[]",
      label: "Invoice Numbers",
      description: "List of invoice numbers to filter by.",
      optional: true,
    },
    invoiceDate: {
      type: "string",
      label: "Invoice Date",
      description: "The date the invoice was issued, in `YYYY-MM-DD` format.",
      optional: true,
    },
    externalIds: {
      type: "string[]",
      label: "External IDs",
      description: "List of external IDs to filter by.",
      optional: true,
    },
    tags: {
      propDefinition: [
        trolley,
        "tags",
      ],
      description: "List of tags to filter by.",
      optional: true,
    },
    memo: {
      propDefinition: [
        trolley,
        "memo",
      ],
      description: "Filter by memo text.",
      optional: true,
    },
    coverFees: {
      propDefinition: [
        trolley,
        "coverFees",
      ],
      description: "Filter by whether the associated payment covers fees.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve (1-indexed).",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page (max `1000`).",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    const response = await this.trolley.searchInvoices({
      $,
      body: {
        invoiceIds: this.invoiceIds,
        paymentIds: this.paymentIds,
        recipientId: this.recipientIds,
        invoiceNumber: this.invoiceNumbers,
        invoiceDate: this.invoiceDate,
        externalId: this.externalIds,
        tags: this.tags,
        memo: this.memo,
        coverFees: this.coverFees,
        page: this.page,
        pageSize: this.pageSize,
      },
    });
    const count = response.invoices?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} invoice(s)`);
    return response;
  },
};
