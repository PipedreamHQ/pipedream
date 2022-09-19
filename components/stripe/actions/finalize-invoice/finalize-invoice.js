const pick = require("lodash.pick");
const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-finalize-invoice",
  name: "Finalize Draft Invoice",
  type: "action",
  version: "0.0.2",
  description: "Finalize a draft invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoices/finalize) for more information",
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
  async run({ $ }) {
    const resp = await this.stripe.sdk().invoices.finalizeInvoice(this.id, pick(this, [
      "auto_advance",
    ]));
    $.export("$summary", `Successfully finalized the invoice, "${resp.id}"`);
    return resp;
  },
};
