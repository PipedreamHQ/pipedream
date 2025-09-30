import app from "../../stripe.app.mjs";

export default {
  key: "stripe-delete-invoice-item",
  name: "Delete Invoice Line Item",
  type: "action",
  version: "0.1.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a line item from an invoice. [See the documentation](https://stripe.com/docs/api/invoiceitems/delete).",
  props: {
    app,
    // Used to populate invoice_item options
    invoice: {
      propDefinition: [
        app,
        "invoice",
      ],
    },
    id: {
      propDefinition: [
        app,
        "invoiceItem",
        ({ invoice }) => ({
          invoice,
        }),
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().invoiceItems.del(this.id);
    $.export("$summary", `Successfully deleted the invoice item with ID \`${resp.id}\`.`);
    return resp;
  },
};
