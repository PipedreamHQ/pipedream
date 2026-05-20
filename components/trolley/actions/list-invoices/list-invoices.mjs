import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-list-invoices",
  name: "List Invoices",
  description: "List all invoices in your merchant account. [See the documentation](https://developers.trolley.com/api/#search-invoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve (1-indexed).",
      optional: true,
      default: 1,
      min: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page (max `1000`).",
      optional: true,
      default: 10,
      min: 1,
      max: 1000,
    },
  },
  async run({ $ }) {
    const response = await this.trolley.searchInvoices({
      $,
      body: {
        page: this.page,
        pageSize: this.pageSize,
      },
    });
    const count = response.invoices?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} invoice(s)`);
    return response;
  },
};
