const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-finalize-invoice",
  name: "Finalize Draft Invoice",
  version: "0.0.1",
  description: "Finalize a draft invoice",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "invoice",
      ],
      optional: false,
    },
    auto_advance: {
      propDefinition: [
        stripe,
        "invoice_auto_advance",
      ],
    },
  },
  async run() {
    return await this.stripe.sdk().invoices.finalizeInvoice(this.id, pick(this, [
      "auto_advance",
    ]));
  },
};
