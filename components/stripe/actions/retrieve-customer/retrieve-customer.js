const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-retrieve-customer",
  name: "Retrieve a Customer",
  version: "0.0.1",
  description: "Retrieves the details of an existing customer.",
  props: {
    stripe,
    id: {
      propDefinition: [
        stripe,
        "customer",
      ],
      required: true,
    },
  },
  async run() {
    return await this.stripe.sdk().customers.retrieve(this.id);
  },
};
