const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-void-invoice",
  name: "Void Invoice",
  type: "action",
  version: "0.0.1",
  description: "Void an invoice",
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
    return await this.stripe.sdk().invoices.voidInvoice(this.id);
  },
};
