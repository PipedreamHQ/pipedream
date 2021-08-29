const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-refund",
  name: "Retrieve a Refund",
  type: "action",
  version: "0.0.1",
  description: "Retrieves the details of an existing refund.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "refund",
      ],
      optional: false,
    },
  },
  async run() {
    return await this.stripe.sdk().refunds.retrieve(this.id);
  },
};
