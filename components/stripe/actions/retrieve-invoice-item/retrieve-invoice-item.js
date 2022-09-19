const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-invoice-item",
  name: "Retrieve Invoice Line Item",
  type: "action",
  version: "0.0.2",
  description: "Retrieve a single line item on an invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/retrieve) for more information",
  props: {
    stripe,
    // Used to filter subscription and invoice options
    customer: {
      propDefinition: [
        stripe,
        "customer",
      ],
    },
    // Used to filter invoice options
    subscription: {
      propDefinition: [
        stripe,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    // Used to populate invoice item options
    invoice: {
      propDefinition: [
        stripe,
        "invoice",
        ({
          customer, subscription,
        }) => ({
          customer,
          subscription,
        }),
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
    const resp = await this.stripe.sdk().invoiceItems.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the invoice item, "${resp.description || resp.id}"`);
    return resp;
  },
};
