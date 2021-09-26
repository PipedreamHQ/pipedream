const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-send-invoice",
  name: "Send Invoice",
  type: "action",
  version: "0.0.1",
  description: "Manually send an invoice to your customer out of the normal schedule for payment " +
    "(note that no emails are actually sent in test mode).",
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
  async run() {
    return await this.stripe.sdk().invoices.sendInvoice(this.id);
  },
};
