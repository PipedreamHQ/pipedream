import app from "../../stripe.app.mjs";

export default {
  key: "stripe-delete-invoice-item",
  name: "Delete Invoice Line Item",
  type: "action",
  version: "0.1.0",
  description: "Delete a line item from an invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/delete) for more information",
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
        "invoice_item",
        ({ invoice }) => ({
          invoice,
        }),
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.app.sdk().invoiceItems.del(this.id);
    $.export("$summary", `Successfully deleted the invoice item, "${resp.id}"`);
    return resp;
  },
};
