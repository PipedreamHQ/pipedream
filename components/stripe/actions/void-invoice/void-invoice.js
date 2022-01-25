const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-void-invoice",
  name: "Void Invoice",
  type: "action",
  version: "0.0.2",
  description: "Void an invoice. [See the docs](https://stripe.com/docs/api/invoices/void) for " +
    "more information",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "invoice",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const resp = await this.stripe.sdk().invoices.voidInvoice(this.id);
    $.export("$summary", `Successfully voided the invoice, "${resp.number || resp.id}"`);
    return resp;
  },
};
