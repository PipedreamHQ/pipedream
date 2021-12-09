const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-send-invoice",
  name: "Send Invoice",
  type: "action",
  version: "0.0.2",
  description: "Manually send an invoice to your customer out of the normal schedule for payment " +
    "(note that no emails are actually sent in test mode). [See the " +
    "docs](https://stripe.com/docs/api/invoices/send) for more information",
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
    const resp = await this.stripe.sdk().invoices.sendInvoice(this.id);
    $.export("$summary", `Successfully sent the invoice, "${resp.number || resp.id}"`);
    return resp;
  },
};
