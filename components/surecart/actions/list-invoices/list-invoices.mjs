import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-invoices",
  name: "List Invoices",
  description: "Return a list of invoices. [See the documentation](https://developer.surecart.com/api-reference/invoices/list)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    customerIds: {
      propDefinition: [
        surecart,
        "customerIds",
      ],
    },
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Full-text search query to filter invoices. Example: `INV-001`",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter invoices by status. Example: `[\"paid\"]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listInvoices,
      args: {
        $,
        params: {
          "customer_ids[]": this.customerIds,
          "ids[]": this.ids,
          "live_mode": this.liveMode,
          "query": this.query,
          "status[]": this.status,
        },
      },
      max: this.maxResults,
    });

    const invoices = [];
    for await (const invoice of results) {
      invoices.push(invoice);
    }

    $.export("$summary", `Successfully retrieved ${invoices.length} invoice(s)`);
    return invoices;
  },
};
