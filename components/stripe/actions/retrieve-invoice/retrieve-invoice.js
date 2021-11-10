const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-invoice",
  name: "Retrieve an Invoice",
  type: "action",
  version: "0.0.1",
  description: "Retrieves the details of an existing invoice.",
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
    return await this.stripe.sdk().invoices.retrieve(this.id);
  },
};
