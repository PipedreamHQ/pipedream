const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-invoice",
  name: "Retrieve an Invoice",
  type: "action",
  version: "0.0.2",
  description: "Retrieves the details of an existing invoice. [See the " +
    "docs](https://stripe.com/docs/api/invoices/retrieve) for more information",
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
    const resp = await this.stripe.sdk().invoices.retrieve(this.id);
    $.export("$summary", `Successfully retrieved the invoice, "${resp.number || resp.id}"`);
    return resp;
  },
};
