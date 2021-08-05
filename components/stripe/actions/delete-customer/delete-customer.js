const stripe = require("../../stripe.app.js");

module.exports = {
  key: "stripe-delete-customer",
  name: "Delete a Customer",
  version: "0.0.1",
  description: "Delete a customer",
  props: {
    stripe,
    customer: {
      propDefinition: [
        stripe,
        "name",
      ],
      required: true,
    },
  },
  async run() {
    return await this.stripe.sdk().customers.del(this.customer);
  },
};
