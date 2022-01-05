const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-delete-invoice-item",
  name: "Delete Invoice Line Item",
  type: "action",
  version: "0.0.2",
  description: "Delete a line item from an invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/delete) for more information",
  props: {
    stripe,
    // Used to populate invoice_item options
    invoice: {
      propDefinition: [
        stripe,
        "invoice",
      ],
    },
    id: {
      propDefinition: [
        stripe,
        "invoice_item",
        ({ invoice }) => ({
          invoice,
        }),
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().invoiceItems.del(this.id);
    $.export("$summary", `Successfully deleted the invoice item, "${resp.id}"`);
    return resp;
  },
};
