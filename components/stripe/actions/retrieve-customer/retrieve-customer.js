const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-customer",
  name: "Retrieve a Customer",
  type: "action",
  version: "0.0.1",
  description: "Retrieves the details of an existing customer.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "customer",
      ],
      optional: false,
    },
  },
  async run() {
    return await this.stripe.sdk().customers.retrieve(this.id);
  },
};
