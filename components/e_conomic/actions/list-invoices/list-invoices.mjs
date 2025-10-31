import economic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-list-invoices",
  name: "List Invoices",
  description: "Retrieves a list of invoices. [See the documentation](https://restdocs.e-conomic.com/#get-invoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    economic,
    invoiceType: {
      type: "string",
      label: "Invoice Type",
      description: "The type of invoice to retrieve",
      options: [
        "booked",
        "drafts",
        "notDue",
        "overdue",
        "paid",
        "sent",
        "totals",
        "unpaid",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of invoices to retrieve",
      optional: true,
      default: 100,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the invoices by. Use `-` to sort in descending order.",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = await this.economic.getPaginatedResources({
      fn: this.economic.listInvoices,
      args: {
        type: this.invoiceType,
        params: {
          sort: this.sort,
        },
      },
      max: this.maxResults,
    });
    $.export("$summary", `Found ${results.length} invoice${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
