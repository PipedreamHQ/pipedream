import app from "../../stripe.app.mjs";

export default {
  key: "stripe-retrieve-invoice-item",
  name: "Retrieve Invoice Line Item",
  type: "action",
  version: "0.1.0",
  description: "Retrieve a single line item on an invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoiceitems/retrieve) for more information",
  props: {
    app,
    // Used to filter subscription and invoice options
    customer: {
      propDefinition: [
        app,
        "customer",
      ],
    },
    // Used to filter invoice options
    subscription: {
      propDefinition: [
        app,
        "subscription",
        ({ customer }) => ({
          customer,
        }),
      ],
    },
    // Used to populate invoice item options
    invoice: {
      propDefinition: [
        app,
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
    const resp = await this.app.sdk().invoiceItems.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the invoice item, "${resp.description || resp.id}"`);
    return resp;
  },
};
